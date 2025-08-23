import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  testConnection,
  insertTestDeveloper,
  searchDevelopersBySkills,
} from "@/lib/test-connection";
import { supabase } from "@/lib/supabaseClient";

export const TestConnection: React.FC = () => {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const runTests = async () => {
    setLoading(true);
    try {
      // Test 1: Conexión básica
      const connectionResult = await testConnection();

      // Test 2: Insertar developer
      const insertResult = await insertTestDeveloper();

      // Test 3: Buscar por skills
      const searchResult = await searchDevelopersBySkills([
        "React",
        "TypeScript",
      ]);

      // Test 4: Obtener developers directamente
      const { data: developers, error: devError } = await supabase
        .from("developers")
        .select("*")
        .limit(3);

      // Test 5: Obtener companies
      const { data: companies, error: compError } = await supabase
        .from("companies")
        .select("*")
        .limit(3);

      setTestResults({
        connection: connectionResult,
        insert: insertResult,
        search: searchResult,
        developers: { data: developers, error: devError },
        companies: { data: companies, error: compError },
      });
    } catch (error: any) {
      setTestResults({ error: error.message });
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults(null);
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          🧪 Pruebas de Conexión Supabase
          <div className="flex gap-2">
            <Button onClick={runTests} disabled={loading}>
              {loading ? "Ejecutando..." : "Ejecutar Pruebas"}
            </Button>
            <Button variant="outline" onClick={clearResults}>
              Limpiar
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {!testResults ? (
          <div className="text-center py-8 text-muted-foreground">
            Haz clic en "Ejecutar Pruebas" para verificar la conexión a Supabase
          </div>
        ) : (
          <div className="space-y-4">
            {/* Connection Test */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔌 Test de Conexión</h3>
              <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(testResults.connection, null, 2)}
              </pre>
            </div>

            {/* Insert Test */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">➕ Test de Inserción</h3>
              <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(testResults.insert, null, 2)}
              </pre>
            </div>

            {/* Search Test */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">🔍 Test de Búsqueda</h3>
              <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                {JSON.stringify(testResults.search, null, 2)}
              </pre>
            </div>

            {/* Direct Query Tests */}
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">📊 Consultas Directas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium mb-2">Developers</h4>
                  <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.developers, null, 2)}
                  </pre>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Companies</h4>
                  <pre className="text-sm bg-muted p-2 rounded overflow-auto">
                    {JSON.stringify(testResults.companies, null, 2)}
                  </pre>
                </div>
              </div>
            </div>

            {/* Summary */}
            <div className="border rounded-lg p-4 bg-muted/50">
              <h3 className="font-semibold mb-2">📋 Resumen</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="font-medium">Conexión:</span>
                  <span
                    className={`ml-2 ${
                      testResults.connection?.success
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {testResults.connection?.success ? "✅" : "❌"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Inserción:</span>
                  <span
                    className={`ml-2 ${
                      testResults.insert?.success
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {testResults.insert?.success ? "✅" : "❌"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Búsqueda:</span>
                  <span
                    className={`ml-2 ${
                      testResults.search?.success
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {testResults.search?.success ? "✅" : "❌"}
                  </span>
                </div>
                <div>
                  <span className="font-medium">Consultas:</span>
                  <span
                    className={`ml-2 ${
                      !testResults.developers?.error &&
                      !testResults.companies?.error
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {!testResults.developers?.error &&
                    !testResults.companies?.error
                      ? "✅"
                      : "❌"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
