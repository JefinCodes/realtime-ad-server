import http from 'k6/http';
import { check } from 'k6';

export const options = {
    vus: 25, 
    duration: '15s',
};

export default function () {

    const payload = JSON.stringify({
        deviceType: "mobile"
    });

    const params = {
        headers: {
            'Content-Type': 'application/json',
        },
    };

    const res = http.post(
        'http://localhost:5000/api/adserver/serve',
        payload,
        params
    );
    
    if (res.status !== 200) {
        console.log(`Status: ${res.status}`);
        console.log(res.body);
    }

    check(res, {
        'status is 200': (r) => r.status === 200,
    });
}
