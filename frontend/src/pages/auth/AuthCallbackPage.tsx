import { Loader } from "lucide-react";
import { Card, CardContent } from "../../components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { useEffect, useRef } from "react";
import { axiostInstance } from "@/lib/axios";
import { useNavigate } from "react-router-dom";

const AuthCallbackPage = () => {
  const { isLoaded, user } = useUser();
  const navigate = useNavigate();
  const syncAttempt = useRef(false);
  useEffect(() => {
    const syncUser = async () => {
      try {
        if (!isLoaded || !user || syncAttempt.current) return;

        syncAttempt.current = true;

        await axiostInstance.post("/auth/callback", {
          id: user.id,
          firstName: user.firstName,
          lastName: user.lastName,
          imageUrl: user.imageUrl,
        });
      } catch (error) {
        console.log("Error syncing user: " + error);
      } finally {
        navigate("/");
      }
    };

    syncUser();
  }, [isLoaded, user, navigate]);

  return (
    <div className="h-screen w-ful bg-black flex items-center justify-center">
      <Card className="w-[90%] max-w-md bg-zinc-900 border-zinc-800">
        <CardContent>
          <Loader className="size-8 text-emerald-500 animate-spin" />
          <h3 className="text-zinc-400 text-xl font-bold">Authenticating</h3>
          <p className="text-zinc-400 text-sm">Redirecting...</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallbackPage;
