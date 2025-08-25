import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, Circle, Mail, LogIn, UserCheck } from "lucide-react";

interface RegistrationFlowInfoProps {
  currentStep: 1 | 2 | 3;
  email?: string;
}

export const RegistrationFlowInfo: React.FC<RegistrationFlowInfoProps> = ({
  currentStep,
  email,
}) => {
  const steps = [
    {
      id: 1,
      title: "Cuenta Creada",
      description: "Tu cuenta ha sido creada exitosamente",
      icon: UserCheck,
      completed: currentStep >= 1,
    },
    {
      id: 2,
      title: "Confirmar Email",
      description: email
        ? `Revisa ${email} y confirma tu cuenta`
        : "Revisa tu email y confirma tu cuenta",
      icon: Mail,
      completed: currentStep >= 2,
    },
    {
      id: 3,
      title: "Iniciar Sesión",
      description: "Una vez confirmado, podrás acceder a tu cuenta",
      icon: LogIn,
      completed: currentStep >= 3,
    },
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800">
      <CardContent className="p-4">
        <h3 className="font-semibold text-blue-900 dark:text-blue-100 mb-3 text-center">
          Proceso de Registro
        </h3>

        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            const isCompleted = step.completed;

            return (
              <div
                key={step.id}
                className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                  isCompleted
                    ? "bg-blue-100 dark:bg-blue-900/30"
                    : "bg-gray-50 dark:bg-gray-800/30"
                }`}
              >
                <div className="flex-shrink-0">
                  {isCompleted ? (
                    <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                    <h4
                      className={`font-medium text-sm ${
                        isCompleted
                          ? "text-blue-900 dark:text-blue-100"
                          : "text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      {step.title}
                    </h4>
                  </div>
                  <p
                    className={`text-xs mt-1 ${
                      isCompleted
                        ? "text-blue-700 dark:text-blue-200"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {step.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-3 p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
          <p className="text-xs text-blue-800 dark:text-blue-200 text-center">
            <strong>💡 Tip:</strong> Si no recibes el email, revisa tu carpeta
            de spam
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
