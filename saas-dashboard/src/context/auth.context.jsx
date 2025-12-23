import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const loadUser = async () => {
        setLoading(true);

        const {
        data: { session },
        } = await supabase.auth.getSession();

        const currentUser = session?.user ?? null;
        setUser(currentUser);

        if (currentUser) {
        const { data: profileData, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", currentUser.id)
            .single();

        if (!error) {
            setProfile(profileData);
        }
        } else {
        setProfile(null);
        }

        setLoading(false);
    };

    useEffect(() => {
        loadUser();

        const {
        data: { subscription },
        } = supabase.auth.onAuthStateChange(() => {
        loadUser();
        });

        return () => subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ user, profile, loading }}>
        {children}
        </AuthContext.Provider>
    );
    }

    export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return context;
    }


