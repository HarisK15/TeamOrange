import { render, fireEvent, cleanup, waitFor } from '@testing-library/react';
import { LoggedInContext } from '../../src/contexts/LoggedInContext';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from '../../src/components/Navbar';
import { describe, it, expect, vitest, afterEach, beforeEach } from "vitest";
import "@testing-library/jest-dom/vitest";
describe('Navbar', () => {
    beforeEach(() => {
        vitest.mock('axios');
    });

    afterEach(() => {
        vitest.clearAllMocks();
        cleanup();
    });
    
    it('renders the correct buttons when logged in', () => {
        const setIsLoggedIn = vitest.fn();
        const contextValue = { isLoggedIn: true, setIsLoggedIn, userId: 'testUser' };

        const { getByText } = render(
            <LoggedInContext.Provider value={contextValue}>
                <Router>
                    <Navbar />
                </Router>
            </LoggedInContext.Provider>
        );

        expect(getByText('Clucks')).toBeInTheDocument();
        expect(getByText('Profile')).toBeInTheDocument();
        expect(getByText('Change Password')).toBeInTheDocument();
        expect(getByText('Logout')).toBeInTheDocument();
    });

    it('renders the correct buttons when logged out', () => {
        const setIsLoggedIn = vitest.fn();
        const contextValue = { isLoggedIn: false, setIsLoggedIn, userId: null };

        const { getByText } = render(
            <LoggedInContext.Provider value={contextValue}>
                <Router>
                    <Navbar />
                </Router>
            </LoggedInContext.Provider>
        );

        expect(getByText('Home')).toBeInTheDocument();
        expect(getByText('Register')).toBeInTheDocument();
        expect(getByText('Login')).toBeInTheDocument();
    });

    it('calls setIsLoggedIn with false when logout is clicked', async () => {
        const setIsLoggedIn = vitest.fn();
        const contextValue = { isLoggedIn: true, setIsLoggedIn, userId: 'testUser' };

        const { getByText } = render(
            <LoggedInContext.Provider value={contextValue}>
                <Router>
                    <Navbar />
                </Router>
            </LoggedInContext.Provider>
        );

        fireEvent.click(getByText('Logout'));
        await waitFor(() => expect(setIsLoggedIn).toHaveBeenCalledWith(false));
    });
});