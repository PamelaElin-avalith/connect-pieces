import React from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw, Clock } from "lucide-react";

interface RateLimitErrorProps {
  error?: Error | null;
  onRetry?: () => void;
  retryAfter?: number;
}

export const RateLimitError: React.FC<RateLimitErrorProps> = ({
  error,
  onRetry,
  retryAfter,
}) => {
  const isRateLimitError =
    error?.message?.includes("429") ||
    error?.message?.toLowerCase().includes("rate limit") ||
    error?.message?.toLowerCase().includes("too many requests");

  if (!isRateLimitError) return null;

  const formatRetryTime = (seconds: number) => {
    if (seconds < 60) return `${seconds} segundos`;
    const minutes = Math.ceil(seconds / 60);
    return `${minutes} minuto${minutes > 1 ? "s" : ""}`;
  };

  return (
    <Alert className="border-orange-200 bg-orange-50 dark:border-orange-800 dark:bg-orange-950/20">
      <AlertCircle className="h-4 w-4 text-orange-600" />
      <AlertTitle className="text-orange-800 dark:text-orange-200">
        Demasiadas solicitudes
      </AlertTitle>
      <AlertDescription className="text-orange-700 dark:text-orange-300">
        <div className="space-y-3">
          <p>
            Has excedido el límite de solicitudes. Por favor, espera un momento
            antes de intentar nuevamente.
          </p>

          {retryAfter && (
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Puedes reintentar en {formatRetryTime(retryAfter)}</span>
            </div>
          )}

          <div className="flex gap-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => window.location.reload()}
              className="border-orange-300 text-orange-700 hover:bg-orange-100 dark:border-orange-700 dark:text-orange-300 dark:hover:bg-orange-900/20"
            >
              Recargar página
            </Button>
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};

// Componente para mostrar diferentes tipos de errores
export const ErrorDisplay: React.FC<{
  error: Error | null;
  onRetry?: () => void;
  retryAfter?: number;
}> = ({ error, onRetry, retryAfter }) => {
  if (!error) return null;

  // Error de rate limiting
  if (
    error.message?.includes("429") ||
    error.message?.toLowerCase().includes("rate limit") ||
    error.message?.toLowerCase().includes("too many requests")
  ) {
    return (
      <RateLimitError error={error} onRetry={onRetry} retryAfter={retryAfter} />
    );
  }

  // Error de conexión
  if (
    error.message?.toLowerCase().includes("network") ||
    error.message?.toLowerCase().includes("fetch") ||
    error.message?.toLowerCase().includes("connection")
  ) {
    return (
      <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertTitle className="text-red-800 dark:text-red-200">
          Error de conexión
        </AlertTitle>
        <AlertDescription className="text-red-700 dark:text-red-300">
          <div className="space-y-3">
            <p>
              No se pudo conectar con el servidor. Verifica tu conexión a
              internet e intenta nuevamente.
            </p>

            <div className="flex gap-2">
              {onRetry && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onRetry}
                  className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reintentar
                </Button>
              )}
            </div>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  // Error genérico
  return (
    <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20">
      <AlertCircle className="h-4 w-4 text-red-600" />
      <AlertTitle className="text-red-800 dark:text-red-200">
        Error inesperado
      </AlertTitle>
      <AlertDescription className="text-red-700 dark:text-red-300">
        <div className="space-y-3">
          <p>Ocurrió un error inesperado: {error.message}</p>

          <div className="flex gap-2">
            {onRetry && (
              <Button
                variant="outline"
                size="sm"
                onClick={onRetry}
                className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-700 dark:text-red-300 dark:hover:bg-red-900/20"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Reintentar
              </Button>
            )}
          </div>
        </div>
      </AlertDescription>
    </Alert>
  );
};
