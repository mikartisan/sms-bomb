import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { AlertCircleIcon, Mail, Rocket, Loader2 } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import React, { useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

// SMS Payload
interface SMSPayload {
    phone_no: number;
    seconds: number;
}

// API Response interface
interface APIResponse {
    success?: boolean;
    message?: string;
    error?: string;
    data?: any;
}

const Home = () => {
    const [number, setNumber] = useState<string>("");
    const [seconds, setSeconds] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [validationMessage, setValidationMessage] = useState<string | null>(
        null
    );

    const validateInputs = (): boolean => {
        if (!number.trim()) {
            setValidationMessage("Please enter a phone number");
            return false;
        }

        if (!seconds.trim()) {
            setValidationMessage("Please enter the number of seconds");
            return false;
        }

        const phoneNumber = parseInt(number, 10);
        const secondsValue = parseInt(seconds, 10);

        if (isNaN(phoneNumber) || phoneNumber <= 0) {
            setValidationMessage("Please enter a valid phone number");
            return false;
        }

        if (isNaN(secondsValue) || secondsValue <= 0) {
            setValidationMessage("Please enter a valid number of seconds");
            return false;
        }

        if (number.length < 11) {
            setValidationMessage("Phone number must be at least 11 digits");
            return false;
        }

        if (secondsValue > 3600) {
            setValidationMessage("Seconds cannot exceed 3600 (1 hour)");
            return false;
        }

        // Clear previous message if all good
        setValidationMessage(null);
        return true;
    };

    const handleSubmit = async (): Promise<void> => {
        if (!validateInputs()) {
            return;
        }

        setIsLoading(true);

        try {
            const payload: SMSPayload = {
                phone_no: parseInt(number, 10),
                seconds: parseInt(seconds, 10),
            };

            const res = await fetch(`${API_URL}/api/sms/send`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });

            const data: APIResponse = await res.json();

            if (res.ok && data.success !== false) {
                // Success case
                toast("SMS Sent Successfully!", {
                    description: `Message sent to ${number} with ${seconds} seconds delay`,
                });

                // Reset form on success
                setNumber("");
                setSeconds("");

                console.log("Success:", data);
            } else {
                // API returned an error
                const errorMessage =
                    data.message || data.error || "Failed to send SMS";
                toast("Failed to Send SMS", {
                    description: errorMessage,
                });
                console.error("API Error:", data);
            }
        } catch (err) {
            // Network or other errors
            const errorMessage =
                err instanceof Error ? err.message : "Network error occurred";
            toast("Connection Error", {
                description: errorMessage,
            });
            console.error("Error sending data:", err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleNumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = e.target.value.replace(/\D/g, "");
        setNumber(value);
    };

    const handleSecondsChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const value = e.target.value.replace(/\D/g, "");
        setSeconds(value);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-background p-4">
            <Toaster position="top-center" />
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <div className="flex items-center justify-center mb-2">
                        <Mail />
                    </div>
                    <CardTitle>SMS BOMBER</CardTitle>
                    <CardDescription>
                        Please use it responsibly. Misuse may lead to
                        consequences outside the control of the developer.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {validationMessage && (
                        <Alert variant="destructive" className="mb-4 text-left">
                            <AlertCircleIcon className="mr-2" />
                            <AlertTitle className="text-left">
                                Validation Error
                            </AlertTitle>
                            <AlertDescription className="text-left">
                                {validationMessage}
                            </AlertDescription>
                        </Alert>
                    )}

                    <div className="flex flex-col gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="number">
                                Phone Number
                                <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="number"
                                type="tel"
                                placeholder="e.g., 09123456789"
                                required
                                value={number}
                                onChange={handleNumberChange}
                                disabled={isLoading}
                                maxLength={15}
                            />
                        </div>
                        <div className="grid gap-2">
                            <Label htmlFor="seconds">
                                Seconds <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                id="seconds"
                                type="number"
                                required
                                placeholder="e.g., 30"
                                value={seconds}
                                onChange={handleSecondsChange}
                                disabled={isLoading}
                                min="1"
                                max="3600"
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="flex-col gap-2">
                    <Button
                        onClick={handleSubmit}
                        className="w-full"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                            </>
                        ) : (
                            <>
                                <Rocket className="mr-2 h-4 w-4" />
                                Send
                            </>
                        )}
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
};

export default Home;
