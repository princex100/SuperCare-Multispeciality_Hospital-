import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AppContext = createContext();

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY;
    const backendUrl =
        import.meta.env.VITE_BACKEND_URL || "http://localhost:8000";

    const [doctors, setDoctors] = useState([]);

    const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Fetch doctors from backend
    const getDoctorsData = async () => {
        try {
            const { data } = await axios.get(
                backendUrl + "/api/doctor/list"
            );

            if (data.success) {
                setDoctors(data.doctors);
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getDoctorsData();
    }, []);

    // Format date
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split("_");
        return (
            dateArray[0] +
            " " +
            months[Number(dateArray[1]) - 1] +
            " " +
            dateArray[2]
        );
    };

    // Calculate age
    const calculateAge = (dob) => {
        const today = new Date();
        const birthDate = new Date(dob);
        let age =
            today.getFullYear() -
            birthDate.getFullYear();

        return age;
    };

    const value = {
        backendUrl,
        currency,
        doctors,
        setDoctors,
        slotDateFormat,
        calculateAge,
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;