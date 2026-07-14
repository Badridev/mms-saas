import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AIManager, type AIAnalysisResult } from "@/lib/ai/manager";

// READ-ONLY: This component provides analysis views and does not expose write operations.

export const AIChatInterface = () => {
  const [analysis, setAnalysis] = useState<AIAnalysisResult | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPage, setSelectedPage] = useState("dashboard");

  const handleDashboardAnalysis = async () => {
    const result = await AIManager.analyzeDashboard('day');
    setAnalysis(result);
  };

  const handleSearch = async () => {
    const result = await AIManager.searchData(searchQuery);
    setAnalysis(result);
  };

  const handlePageContextAnalysis = async () => {
    const result = await AIManager.analyzePageContext(selectedPage);
    setAnalysis(result);
  };

  return (
    <Card className="w-full max-w-lg mb-6">
      <CardHeader>
        <CardTitle>MMS AI CORE (Read-Only Analysis)</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <Button onClick={handleDashboardAnalysis}>Analyser Dashboard (Jour)</Button>
          
          <div className="flex gap-2">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher dans l'ERP..."
            />
            <Button onClick={handleSearch}>Rechercher</Button>
          </div>

          <div className="flex gap-2">
            <Select onValueChange={setSelectedPage} defaultValue={selectedPage}>
              <SelectTrigger>
                <SelectValue placeholder="Sélectionner une page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dashboard">Tableau de Bord</SelectItem>
                <SelectItem value="ventes">Gestion des Ventes</SelectItem>
              </SelectContent>
            </Select>
            <Button onClick={handlePageContextAnalysis}>Analyser Page</Button>
          </div>

          {analysis && (
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <p className="font-semibold text-sm">{analysis.summary}</p>
              <ul className="mt-2 text-sm text-muted-foreground list-disc list-inside">
                {analysis.recommendations?.map((rec, i) => (
                  <li key={i}>{rec}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
