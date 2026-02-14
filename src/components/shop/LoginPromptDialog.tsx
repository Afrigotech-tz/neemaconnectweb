import { LogIn, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface LoginPromptDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const LoginPromptDialog: React.FC<LoginPromptDialogProps> = ({ open, onOpenChange }) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Login Required</AlertDialogTitle>
          <AlertDialogDescription>
            You need to be logged in to add items to your cart. Please login or create an account to continue shopping.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Continue Browsing
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              navigate('/register');
            }}
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Register
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              navigate('/login');
            }}
          >
            <LogIn className="mr-2 h-4 w-4" />
            Login
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default LoginPromptDialog;
