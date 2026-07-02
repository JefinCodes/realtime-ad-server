import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
} from "react";
import toast from "react-hot-toast";

import { supabase } from "../supabase/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        async function initialize() {
            const {
                data: { session },
            } = await supabase.auth.getSession();

            if (!mounted) return;

            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }

        initialize();

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            if (!mounted) return;

            setSession(session);
            setUser(session?.user ??null);
            setLoading(false);
        });

        return () => {
            mounted = false;
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email, password) => {
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);

            return {
                success: false,
                error,
            };
        }

        toast.success("Welcome back!");

        return {
            success: true,
        };
    };

    const signup = async (email, password) => {
        const { error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) {
            toast.error(error.message);

            return {
                success: false,
                error,
            };
        }

        /*
            Backend uses lazy advertiser creation.
            Therefore NO backend signup request is made.
            The advertiser is automatically created
            on the first authenticated backend request.
        */

        toast.success("Account created successfully!");

        return {
            success: true,
        };
    };

    const logout = async () => {
        await supabase.auth.signOut();

        toast.success("Logged out");
    };

    const value = useMemo(
        () => ({
            user,
            session,
            loading,
            login,
            signup,
            logout,
            isAuthenticated: !!session,
        }),
        [user, session, loading]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used within AuthProvider");
    }

    return context;
}
