import { useContext, useEffect } from "react";
import {
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContext } from "../context/AppContext";

const VerifyEmail = () => {

    const navigate = useNavigate();

    const [searchParams] =
        useSearchParams();

    const {
        backendUrl,
        setToken
    } = useContext(AppContext);

    useEffect(() => {

        const verify =
            async () => {

                try {

                    const token =
                        searchParams.get(
                            "token"
                        );

                    // invalid token
                    if (!token) {
                        toast.error(
                            "Invalid verification link"
                        );

                        return navigate(
                            "/login"
                        );
                    }

                    const { data } =
                        await axios.get(
                            `${backendUrl}/api/user/verify-email?token=${token}`
                        );

                    // verification failed
                    if (!data.success) {

                        toast.error(
                            data.message
                        );

                        return navigate(
                            "/login"
                        );
                    }

                    // auto login
                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    setToken(
                        data.token
                    );

                    toast.success(
                        "Email verified successfully"
                    );

                    navigate("/");

                } catch (error) {

                    console.log(error);

                    toast.error(
                        error.message
                    );

                    navigate("/login");
                }
            };

        verify();

    }, []);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <h2 className="text-xl font-medium">
                Verifying Email...
            </h2>
        </div>
    );
};

export default VerifyEmail;