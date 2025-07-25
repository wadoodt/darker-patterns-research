import React from "react";

type SignupSubmitButtonProps = {
  isLoading: boolean;
  signupType: "new" | "existing";
  selectedPlan: string;
  t: (key: string) => string;
};

const SignupSubmitButton: React.FC<SignupSubmitButtonProps> = ({
  isLoading,
  signupType,
  selectedPlan,
  t,
}) => (
  <button
    type="submit"
    className="w-full py-3 rounded-md bg-black text-white font-semibold text-lg border-none mb-2 disabled:opacity-60 disabled:cursor-not-allowed"
    disabled={isLoading || (signupType === "new" && !selectedPlan)}
    aria-label={
      isLoading
        ? t("auth.signup.buttons.signingUp")
        : signupType === "new"
          ? t("auth.signup.buttons.createAccount")
          : t("auth.signup.buttons.joinBusiness")
    }
  >
    {isLoading
      ? t("auth.signup.buttons.signingUp")
      : signupType === "new"
        ? t("auth.signup.buttons.createAccount")
        : t("auth.signup.buttons.joinBusiness")}
  </button>
);

export default SignupSubmitButton;
