
import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertDealerSignupSchema, type InsertDealerSignup } from "@shared/schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Building, Send } from "lucide-react";

interface DealerSignupFormProps {
  theme?: string;
}

export default function DealerSignupForm({ theme }: DealerSignupFormProps) {
  const { toast } = useToast();

  // Fetch sales agents
  const { data: salesAgentsData, isLoading: isLoadingSalesAgents } = useQuery({
    queryKey: ["sales-agents"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/sales-agents");
      return response.json();
    },
  });

  const salesAgents = salesAgentsData?.agents || [];

  const form = useForm<InsertDealerSignup>({
    resolver: zodResolver(insertDealerSignupSchema),
    defaultValues: {
      dealershipName: "",
      contactName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zipCode: "",
      dealerLicense: "",
      monthlyInventory: "",
      currentSoftware: "",
      interestedFeatures: [],
      salesAgentId: "",
    },
  });

  const signupMutation = useMutation({
    mutationFn: async (data: InsertDealerSignup) => {
      const response = await apiRequest("POST", "/api/dealer-signup", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Thank you for your interest! We'll be in touch within 24 hours.",
      });
      form.reset();
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to submit signup. Please try again.";
      toast({
        variant: "destructive",
        title: "Error",
        description: errorMessage,
      });
    },
  });

  const onSubmit = (data: InsertDealerSignup) => {
    signupMutation.mutate(data);
  };

  const featureOptions = [
    "KBB & MMR Appraisals",
    "Carfax & AutoCheck Integration", 
    "E-Signature",
    "Mobile Interface",
    "Social Media Integration",
    "Inventory Management",
    "Customer Management",
    "Sales Tracking",
    "BHPH Tools",
    "Credit Applications"
  ];

  return (
    <Card className={`w-full max-w-4xl mx-auto ${theme === 'dark' ? 'bg-gray-800 border-gray-700' : ''}`}>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-orange-500 rounded-2xl flex items-center justify-center">
            <Building className="w-6 h-6 text-white" />
          </div>
          <CardTitle className={`text-3xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
            Join Cargram Pro
          </CardTitle>
        </div>
        <CardDescription className={`text-lg ${theme === 'dark' ? 'text-gray-300' : ''}`}>
          Get early access to the DMS that moves metal. Built by dealers, for dealers.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Dealership Information */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                Dealership Information
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dealershipName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Dealership Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="ABC Auto Sales"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="contactName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Contact Name *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="John Smith"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Email Address *
                      </FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="john@abcauto.com"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Phone Number *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="(555) 123-4567"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Address Information */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                Location
              </h3>
              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Street Address *
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123 Main Street"
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                  </FormItem>
                )}
              />
              <div className="grid md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        City *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Los Angeles"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        State *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="CA"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Zip Code *
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="90210"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Business Details */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                Business Details
              </h3>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dealerLicense"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Dealer License (Optional)
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="DL123456"
                          className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="monthlyInventory"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                        Monthly Inventory *
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                            <SelectValue placeholder="Select inventory size" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="select-content">
                          <SelectItem value="1-25">1-25 vehicles</SelectItem>
                          <SelectItem value="26-50">26-50 vehicles</SelectItem>
                          <SelectItem value="51-100">51-100 vehicles</SelectItem>
                          <SelectItem value="101-250">101-250 vehicles</SelectItem>
                          <SelectItem value="250+">250+ vehicles</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="currentSoftware"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Current DMS Software (Optional)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., DealerTrack, Reynolds, or None"
                        className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="salesAgentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className={theme === 'dark' ? 'text-gray-300' : ''}>
                      Preferred Sales Agent (Optional)
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className={theme === 'dark' ? 'bg-gray-700 border-gray-600 text-white' : ''}>
                          <SelectValue placeholder={isLoadingSalesAgents ? "Loading agents..." : "Select a sales agent"} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="select-content">
                        {salesAgents.map((agent: any) => (
                          <SelectItem key={agent.id} value={agent.id}>
                            {agent.first_name} {agent.last_name}
                          </SelectItem>
                        ))}
                        <SelectItem value="no-preference">No Preference</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                  </FormItem>
                )}
              />
            </div>

            {/* Interested Features */}
            <div className="space-y-4">
              <h3 className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>
                Features of Interest
              </h3>
              <FormField
                control={form.control}
                name="interestedFeatures"
                render={() => (
                  <FormItem>
                    <div className="grid md:grid-cols-2 gap-2">
                      {featureOptions.map((feature) => (
                        <FormField
                          key={feature}
                          control={form.control}
                          name="interestedFeatures"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={feature}
                                className="flex flex-row items-start space-x-3 space-y-0"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(feature)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...field.value, feature])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== feature
                                            )
                                          );
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className={`text-sm font-normal ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                                  {feature}
                                </FormLabel>
                              </FormItem>
                            );
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              size="xl"
              variant="automotive"
              className="w-full capsule-btn"
              disabled={signupMutation.isPending}
            >
              <Send className="w-5 h-5" />
              {signupMutation.isPending ? "Submitting..." : "Get Cargram Pro Demo"}
            </Button>

            <p className={`text-sm text-center ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
              We'll contact you within 24 hours to schedule your personalized demo.
            </p>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
