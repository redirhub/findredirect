import { useState, useEffect } from 'react';

export function useDevice() {
    const [ isMobile, setIsMobile ] = useState(false);
    const [ isTablet, setIsTablet ] = useState(false);
    const [ isDesktop, setIsDesktop ] = useState(false);

    useEffect(() => {
        const checkIfMobile = () => {
            setIsMobile(window.innerWidth < 768);
            setIsTablet(window.innerWidth >= 768 && window.innerWidth < 992);
            setIsDesktop(window.innerWidth >= 992);
        };

        // Check on initial load
        checkIfMobile();

        // Add event listener for window resize
        window.addEventListener('resize', checkIfMobile);

        // Cleanup
        return () => window.removeEventListener('resize', checkIfMobile);
    }, []);

    return { isMobile, isTablet, isDesktop };
}