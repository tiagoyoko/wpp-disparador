"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Calendar,
  MessageSquare,
  Plus,
  Trash2,
  AlertCircle,
  Info,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";

export default function NewCampaignPage() {
  const { data: session, isPending } = useSession();
  const [activeTab, setActiveTab] = useState("message");
  const [campaignName, setCampaignName] = useState("");
  const [campaignDescription, setCampaignDescription] = useState("");
  const [message, setMessage] = useState("");
  const [selectedList, setSelectedList] = useState("");
  const [selectedInstance, setSelectedInstance] = useState("");
  const [useVariations, setUseVariations] = useState(true);
  const [variations, setVariations] = useState<string[]>([""]);
  const [sendingSpeed, setSendingSpeed] = useState(10);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  // Dados simulados para demonstração
  const contactLists = [
    { id: "1", name: "Clientes Ativos", count: 245 },
    { id: "2", name: "Leads Recentes", count: 78 },
    { id: "3", name: "Aniversariantes", count: 32 },
  ];

  const instances = [
    {
      id: "1",
      name: "Principal",
      phone: "+5511987654321",
      status: "connected",
    },
    { id: "2", name: "Suporte", phone: "+5511912345678", status: "connected" },
    { id: "3", name: "Marketing", status: "disconnected" },
  ];

  const addVariation = () => {
    setVariations([...variations, ""]);
  };

  const updateVariation = (index: number, value: string) => {
    const newVariations = [...variations];
    newVariations[index] = value;
    setVariations(newVariations);
  };

  const removeVariation = (index: number) => {
    if (variations.length > 1) {
      const newVariations = variations.filter((_, i) => i !== index);
      setVariations(newVariations);
    }
  };

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);
    setSubmitSuccess(false);

    try {
      // Simulando lista de contatos para demonstração
      // Em produção, buscaríamos do banco de dados com base no selectedList
      const mockContactList = [
        { id: "1", name: "João Silva", phone: "5511987654321" },
        { id: "2", name: "Maria Oliveira", phone: "5511912345678" },
        { id: "3", name: "Pedro Santos", phone: "5511998765432" },
      ];

      // Simulando chave da instância para demonstração
      // Em produção, buscaríamos do banco de dados com base no selectedInstance
      const mockInstanceKey = "sua-chave-de-instancia-aqui";

      const payload = {
        name: campaignName,
        description: campaignDescription,
        message,
        instanceId: selectedInstance,
        instanceKey: mockInstanceKey, // Em produção, usar a chave real da instância
        contactList: mockContactList, // Em produção, usar a lista real de contatos
        useVariations,
        variations: useVariations
          ? variations.filter((v) => v.trim() !== "")
          : [],
        sendingSpeed,
        isScheduled,
        scheduledDate,
        scheduledTime,
      };

      // Enviar para a API
      const response = await fetch("/api/campaigns/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao enviar campanha");
      }

      setSubmitSuccess(true);

      // Redirecionar para a página de campanhas após 2 segundos
      setTimeout(() => {
        window.location.href = "/campaigns";
      }, 2000);
    } catch (error) {
      console.error("Erro ao enviar campanha:", error);
      setSubmitError(
        error instanceof Error ? error.message : "Erro desconhecido"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <div className="animate-pulse text-muted-foreground">Carregando...</div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <MessageSquare className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Área Restrita</h1>
            <p className="text-muted-foreground mb-6">
              Você precisa estar logado para criar campanhas
            </p>
          </div>
          <Button asChild>
            <Link href="/login">Fazer Login</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center gap-2 mb-6">
        <Button asChild variant="ghost" size="icon">
          <Link href="/campaigns">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Nova Campanha</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Informações da Campanha
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="name">Nome da Campanha</Label>
                  <Input
                    id="name"
                    placeholder="Ex: Promoção de Fim de Semana"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="description">Descrição (opcional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Descreva o objetivo desta campanha"
                    value={campaignDescription}
                    onChange={(e) => setCampaignDescription(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle>Mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="message" onValueChange={setActiveTab}>
                  <TabsList className="mb-4">
                    <TabsTrigger value="message">Mensagem</TabsTrigger>
                    <TabsTrigger value="variations">Variações</TabsTrigger>
                    <TabsTrigger value="preview">Pré-visualização</TabsTrigger>
                  </TabsList>

                  <TabsContent value="message">
                    <div className="space-y-4">
                      <Textarea
                        placeholder="Digite sua mensagem aqui..."
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={8}
                        required
                      />
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Info className="h-4 w-4" />
                        <span>
                          Use {"{nome}"} para inserir o nome do contato na
                          mensagem
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="variations">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <Switch
                          id="use-variations"
                          checked={useVariations}
                          onCheckedChange={setUseVariations}
                        />
                        <Label htmlFor="use-variations">
                          Usar variações de mensagem (recomendado)
                        </Label>
                      </div>

                      {useVariations && (
                        <>
                          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-md flex items-start gap-2">
                            <AlertCircle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <div className="text-sm">
                              <p className="font-medium text-amber-500">
                                Por que usar variações?
                              </p>
                              <p className="text-muted-foreground">
                                Usar variações de mensagens reduz
                                significativamente o risco de banimento, pois
                                evita que o WhatsApp identifique envios em massa
                                idênticos.
                              </p>
                            </div>
                          </div>

                          <div className="space-y-3">
                            {variations.map((variation, index) => (
                              <div key={index} className="flex gap-2">
                                <Textarea
                                  placeholder={`Variação ${index + 1}`}
                                  value={variation}
                                  onChange={(e) =>
                                    updateVariation(index, e.target.value)
                                  }
                                  rows={3}
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeVariation(index)}
                                  disabled={variations.length === 1}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            ))}
                          </div>

                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={addVariation}
                            className="mt-2"
                          >
                            <Plus className="h-4 w-4 mr-2" />
                            Adicionar Variação
                          </Button>
                        </>
                      )}
                    </div>
                  </TabsContent>

                  <TabsContent value="preview">
                    <div className="border rounded-lg p-4 bg-muted/30">
                      <div className="bg-background rounded-lg p-4 max-w-sm mx-auto border shadow-sm">
                        <div className="text-sm font-medium mb-2 text-green-600">
                          WhatsApp Preview
                        </div>
                        <div className="bg-[#e2ffc7] p-3 rounded-lg text-black text-sm">
                          {message || "Sua mensagem aparecerá aqui..."}
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Envio</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="contact-list">Lista de Contatos</Label>
                  <Select
                    value={selectedList}
                    onValueChange={setSelectedList}
                    required
                  >
                    <SelectTrigger id="contact-list">
                      <SelectValue placeholder="Selecione uma lista" />
                    </SelectTrigger>
                    <SelectContent>
                      {contactLists.map((list) => (
                        <SelectItem key={list.id} value={list.id}>
                          {list.name} ({list.count} contatos)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="instance">Instância do WhatsApp</Label>
                  <Select
                    value={selectedInstance}
                    onValueChange={setSelectedInstance}
                    required
                  >
                    <SelectTrigger id="instance">
                      <SelectValue placeholder="Selecione uma instância" />
                    </SelectTrigger>
                    <SelectContent>
                      {instances
                        .filter((instance) => instance.status === "connected")
                        .map((instance) => (
                          <SelectItem key={instance.id} value={instance.id}>
                            {instance.name} ({instance.phone})
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sending-speed">Velocidade de Envio</Label>
                    <span className="text-sm text-muted-foreground">
                      {sendingSpeed} msgs/min
                    </span>
                  </div>
                  <Slider
                    id="sending-speed"
                    min={1}
                    max={30}
                    step={1}
                    value={[sendingSpeed]}
                    onValueChange={(value) => setSendingSpeed(value[0])}
                  />
                  <p className="text-xs text-muted-foreground">
                    Recomendamos até 10 msgs/min para reduzir o risco de
                    banimento
                  </p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="schedule"
                      checked={isScheduled}
                      onCheckedChange={setIsScheduled}
                    />
                    <Label
                      htmlFor="schedule"
                      className="flex items-center gap-2"
                    >
                      <Calendar className="h-4 w-4" />
                      Agendar envio
                    </Label>
                  </div>

                  {isScheduled && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="date">Data</Label>
                        <Input
                          id="date"
                          type="date"
                          value={scheduledDate}
                          onChange={(e) => setScheduledDate(e.target.value)}
                          required={isScheduled}
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">Hora</Label>
                        <Input
                          id="time"
                          type="time"
                          value={scheduledTime}
                          onChange={(e) => setScheduledTime(e.target.value)}
                          required={isScheduled}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              {submitError && (
                <div className="p-3 bg-destructive/10 text-destructive rounded-md flex items-start gap-2">
                  <AlertCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              {submitSuccess && (
                <div className="p-3 bg-green-500/10 text-green-500 rounded-md flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                  <span>
                    {isScheduled
                      ? "Campanha agendada com sucesso!"
                      : "Campanha iniciada com sucesso!"}
                  </span>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  <Link href="/campaigns">Cancelar</Link>
                </Button>
                <Button
                  type="submit"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin mr-2">◌</span>
                      {isScheduled ? "Agendando..." : "Iniciando..."}
                    </>
                  ) : isScheduled ? (
                    "Agendar Campanha"
                  ) : (
                    "Iniciar Campanha"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
