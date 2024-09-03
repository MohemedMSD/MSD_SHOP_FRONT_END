import React, { useEffect } from 'react';

function Timer({ onResend, timeRemaining, setTimeRemaining, setSendButton, setSuccess }) {

    useEffect(() => {
        
        const timer = setInterval(() => {
            setTimeRemaining(prevTime => {
                const newTime = prevTime - 1;

                if (newTime <= 0) {
                    clearInterval(timer);
                    sessionStorage.removeItem('timer')
                    sessionStorage.removeItem('userEmail')
                    setSendButton(true)
                    setSuccess(false)
                    return 0
                }else{
                    sessionStorage.setItem('timer', prevTime - 1)
                }

                
                return newTime;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const formatTime = (time)=> {
        return `${Math.floor(time/60)}:${(time%60).toString().padStart(2, '0')}`
    }

    return (
        <div>
            <p className='text-center'>The verification link expire in : <span className='text-second font-semibold'>{formatTime(timeRemaining)} </span></p>
        </div>
    );
}

export default Timer;
