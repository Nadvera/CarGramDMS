import React, { useState, useEffect } from "react";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { insertEmailSubscriptionSchema, type InsertEmailSubscription } from "@shared/schema";
import {
  Car,
  Zap,
  Users,
  Smartphone,
  ShieldCheck,
  TrendingUp,
  Building,
  Camera,
  Heart,
  Calendar,
  Target,
  Clock,
  Instagram,
  Twitter,
  Facebook,
  Sun,
  Moon,
  Phone,
  Info,
  Send,
  MapPin,
  Mail,
  Headphones,
} from "lucide-react";

export default function Landing() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [iframeError, setIframeError] = useState(false);

  // Email subscription form
  const form = useForm<InsertEmailSubscription>({
    resolver: zodResolver(insertEmailSubscriptionSchema),
    defaultValues: {
      email: "",
    },
  });

  // Email subscription mutation
  const subscriptionMutation = useMutation({
    mutationFn: async (data: InsertEmailSubscription) => {
      const response = await apiRequest("POST", "/api/subscribe", data);
      return response.json();
    },
    onSuccess: (data) => {
      toast({
        title: "Success!",
        description: "Thank you for subscribing to our newsletter!",
      });
      form.reset(); // Clear the form
    },
    onError: (error: any) => {
      const errorMessage = error.message || "Failed to subscribe. Please try again.";

      // Parse status code from error message (format: "409: error text")
      const statusMatch = errorMessage.match(/^(\d+):/);
      const statusCode = statusMatch ? parseInt(statusMatch[1], 10) : null;
      const isDuplicate = statusCode === 409;

      // Show toast notification
      toast({
        variant: "destructive",
        title: "Error",
        description: isDuplicate ? "You're already subscribed to our newsletter!" : errorMessage,
      });

      // Set form-level error for better accessibility
      if (isDuplicate) {
        form.setError("email", {
          type: "manual",
          message: "This email is already subscribed",
        });
      }
    },
  });

  const onSubmit = (data: InsertEmailSubscription) => {
    subscriptionMutation.mutate(data);
  };

  const scrollToForm = () => {
    document.getElementById("lead-form")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  // Iframe watchdog timer to handle cases where neither onLoad nor onError fires
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!iframeLoaded && !iframeError) {
        setIframeError(true);
      }
    }, 8000); // 8 second timeout

    return () => clearTimeout(timer);
  }, [iframeLoaded, iframeError]);

  // Intersection Observer for animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("fade-in-up");
        }
      });
    }, observerOptions);

    document.querySelectorAll("section > div").forEach((section) => {
      observer.observe(section);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900 text-gray-100' : 'bg-background text-foreground'}`}>
      {/* Header Navigation */}
      <header className={`fixed top-0 left-0 right-0 z-50 ${theme === 'dark' ? 'bg-gray-800/90 shadow-lg' : 'header-glassmorphism'}`}>
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-3" data-testid="logo">
              <img
                src={theme === 'dark' ? '/images/logo-label-cursive-darkmode.png' : '/images/logo-label-cursive.png'}
                alt="Cargram Logo"
                className="h-8 w-auto"
              />
            </div>

            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="#features"
                className={` ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
                data-testid="nav-features"
              >
                Features
              </a>
              <a
                href="#community"
                className={` ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
                data-testid="nav-community"
              >
                Community
              </a>
              <a
                href="#support"
                className={` ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'} transition-colors`}
                data-testid="nav-support"
              >
                Support
              </a>
            </nav>

            {/* Action Buttons */}
            <div className="flex items-center space-x-4">
              {/* Theme Toggle */}
              <Button
                variant="outline"
                size="icon"
                onClick={() => setTheme(theme === "light" ? "dark" : "light")}
                className={`capsule-btn ${theme === 'dark' ? 'border-gray-600 hover:bg-gray-700' : 'border-border hover:bg-accent'}`}
                data-testid="theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : ''}`} />
                ) : (
                  <Sun className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : ''}`} />
                )}
              </Button>

              {/* Login Button */}
              <Button
                asChild
                variant="automotive"
                size="default"
                className="capsule-btn"
                data-testid="login-button"
              >
                <a href="https://cargram.app" target="_blank" rel="noopener noreferrer">
                  Login
                </a>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={`hero-gradient text-white pt-24 pb-16 min-h-screen flex items-center relative overflow-hidden ${theme === 'dark' ? 'bg-gray-900' : ''}`}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-32 h-16 opacity-20">
            <Car className="w-full h-full" />
          </div>
          <div className="absolute top-40 right-20 w-24 h-12 opacity-15">
            <Car className="w-full h-full" />
          </div>
          <div className="absolute bottom-32 left-1/4 w-28 h-14 opacity-25">
            <Car className="w-full h-full" />
          </div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <div className="space-y-8 fade-in-up" data-testid="hero-content">
              <div className="space-y-4">
                <h1 className={`font-queen text-5xl lg:text-7xl font-bold leading-tight ${theme === 'dark' ? 'text-white' : 'text-white'}`}>
                  Where Business Meets
                  <span className="font-instagram block text-transparent bg-gradient-to-r from-blue-200 to-orange-200 bg-clip-text">
                    Car Culture
                  </span>
                </h1>
                <p className={`text-xl lg:text-2xl ${theme === 'dark' ? 'text-gray-200' : 'text-blue-50'} max-w-lg font-medium`}>
                  Professional DMS that moves metal + Social platform where car culture lives. Two sides of the automotive world, one vision.
                </p>
              </div>

              {/* Hero Stats */}
              <div className="flex flex-wrap gap-8 text-sm" data-testid="hero-stats">
                <div className="flex items-center space-x-2">
                  <Building className="w-5 h-5 text-orange-400" />
                  <span className={theme === 'dark' ? 'text-gray-300' : ''}>Hundreds of Dealers</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span className={theme === 'dark' ? 'text-gray-300' : ''}>12+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span className={theme === 'dark' ? 'text-gray-300' : ''}>Nationwide Coverage</span>
                </div>
              </div>

              {/* Hero Actions */}
              <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-actions">
                <Button
                  variant="orange"
                  size="xl"
                  className="capsule-btn"
                  data-testid="demo-dms-button"
                >
                  <Zap className="w-5 h-5" />
                  Demo Cargram DMS
                </Button>
                <Button
                  onClick={scrollToForm}
                  variant="outline"
                  size="xl"
                  className={`capsule-btn ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600 border-gray-600 text-white' : 'bg-white/10 hover:bg-white/20 text-white border-white/20'}`}
                  data-testid="get-updates-button"
                >
                  <Mail className="w-5 h-5" />
                  Get Updates
                </Button>
              </div>
            </div>

            {/* Hero Visual - DMS Screenshot */}
            <div className="flex justify-center lg:justify-end" data-testid="hero-visual">
              <div className="relative">
                {/* Modern desktop mockup with DMS screenshot */}
                <div className={`bg-gray-900 rounded-2xl p-4 shadow-2xl float-animation ${theme === 'dark' ? 'dark' : ''}`}>
                  <div className="bg-gray-800 rounded-t-xl px-4 py-2 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <div className="flex-1 bg-gray-700 rounded px-3 py-1 text-gray-300 text-sm text-center">
                      Cargram DMS - Lightning Fast
                    </div>
                  </div>
                  <div className="w-full max-w-2xl">
                    <img
                      src="/images/homeHero.webp"
                      alt="DealerClick DMS Dashboard"
                      className="w-full h-auto rounded-b-xl"
                    />
                  </div>
                </div>

                {/* Floating badges */}
                <div className="absolute -top-4 -right-4 bg-orange-500 rounded-xl px-3 py-2 shadow-lg">
                  <span className="text-white text-sm font-bold">Mobile First</span>
                </div>
                <div className="absolute -bottom-4 -left-4 bg-green-500 rounded-xl px-3 py-2 shadow-lg">
                  <span className="text-white text-sm font-bold">eContracting</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section id="lead-form" className={`py-16 ${theme === 'dark' ? 'bg-gray-800' : 'bg-secondary/50'}`} data-testid="lead-capture-section">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className={`glassmorphism rounded-3xl p-8 space-y-6 ${theme === 'dark' ? 'bg-gray-900 shadow-xl' : ''}`}>
              <div className="space-y-4">
                <h2 className={`font-queen text-3xl lg:text-4xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
                  Stay in the Fast Lane
                </h2>
                <p className={`text-muted-foreground text-lg ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                  Be the first to know about new features, community events, and
                  automotive trends. Join our exclusive newsletter.
                </p>
              </div>

              {/* Email Form */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" data-testid="email-form">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Enter your email address"
                              className={`form-input ${theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:ring-blue-500' : ''}`}
                              data-testid="input-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className={theme === 'dark' ? 'text-red-400' : ''} />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="submit"
                      variant="automotive"
                      size="lg"
                      className="capsule-btn"
                      disabled={subscriptionMutation.isPending || !form.formState.isValid}
                      data-testid="button-subscribe"
                    >
                      <Send className={`w-5 h-5 ${theme === 'dark' ? 'text-white' : ''}`} />
                      {subscriptionMutation.isPending ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>
                  <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
                    No spam, unsubscribe at any time. We respect your privacy.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section - DMS Focus */}
      <section id="features" className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : ''}`} data-testid="features-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className={`font-queen text-4xl lg:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : ''}`}>
              Cargram DMS - Built Different
            </h2>
            <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} max-w-3xl mx-auto`}>
              The mobile-first DMS that closes deals on the lot, not just in the office.
              Years of automotive software expertise, serving dealers nationwide.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* DMS Feature Cards */}
            {[
              {
                icon: Zap,
                title: "Lightning Fast eContracting",
                description:
                  "Close deals at the speed of handshakes. Sign contracts on mobile, tablet, or desktop with instant processing.",
                gradient: "from-yellow-500 to-orange-500",
              },
              {
                icon: Smartphone,
                title: "Fully Mobile Responsive",
                description:
                  "DMS that works in the lot, not just the office. Manage inventory, customers, and sales from anywhere.",
                gradient: "from-pink-500 to-purple-500 via-gold-500",
              },
              {
                icon: ShieldCheck,
                title: "All Major Integrations",
                description:
                  "DataOne, KBB, AutoCheck, CarFax, 700Credit, Payment Processing, BHPH, Motives Insurance, All major lenders + Plaid.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: TrendingUp,
                title: "Extremely Easy to Use",
                description:
                  "Built for hustlers, not IT departments. Your team will be productive in minutes, not months.",
                gradient: "from-purple-500 to-indigo-600",
              },
              {
                icon: Building,
                title: "BHPH Specialists",
                description:
                  "From independent lots to BHPH specialists. We speak every dealership's language with custom workflows.",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                icon: Camera,
                title: "Coming Soon: Social Integration",
                description:
                  "Your customers don't just buy cars - they live car life. Soon, connect your DMS to automotive social marketplace.",
                gradient: "from-orange-500 to-red-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className={`glassmorphism rounded-2xl p-8 space-y-6 hover-scale transition-transform duration-200 ${theme === 'dark' ? 'bg-gray-800 shadow-lg' : ''}`}
                data-testid={`feature-card-${index}`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>{feature.title}</h3>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section - Cargram Social Coming Soon */}
      <section
        id="community"
        className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-primary/5 to-orange-500/5'}`}
        data-testid="community-section"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className={`font-queen text-4xl lg:text-5xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
                Coming Soon: Cargram Social
              </h2>
              <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'} leading-relaxed`}>
                The DMS guy who actually gets car culture is building social too.
                Where proven business software meets automotive passion - connecting both sides of the car world.
              </p>
              <div className={`inline-flex items-center space-x-2 rounded-full px-4 py-2 ${theme === 'dark' ? 'bg-orange-500/20' : 'bg-orange-500/10'}`}>
                <div className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></div>
                <span className={theme === 'dark' ? 'text-orange-400 text-sm font-medium' : 'text-orange-600 text-sm font-medium'}>Small beta community, big vision ahead</span>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Automotive Social Marketplace",
                  description:
                    "Evolving into where passion meets commerce. Show off inventory, connect over car culture, and discover your next ride through community.",
                  color: "text-red-500",
                },
                {
                  icon: Calendar,
                  title: "Events & Meets",
                  description:
                    "Car shows, meetups, and automotive events. Bringing digital relationships to real gatherings where rubber meets the road.",
                  color: "text-blue-500",
                },
                {
                  icon: Target,
                  title: "DMS + Social Integration",
                  description:
                    "Dealers showing off inventory on social. Customers connecting over car culture. Business software that understands car life.",
                  color: "text-green-500",
                },
                {
                  icon: Clock,
                  title: "Currently Beta Phase",
                  description:
                    "Functional but not finished. Growing organically with real car enthusiasts who understand the vision of authentic automotive community.",
                  color: "text-purple-500",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className={`glassmorphism rounded-2xl p-8 text-left space-y-4 ${theme === 'dark' ? 'bg-gray-800 shadow-lg' : ''}`}
                  data-testid={`community-feature-${index}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    <h3 className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>{feature.title}</h3>
                  </div>
                  <p className={theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}>{feature.description}</p>
                </div>
              ))}
            </div>

            <div className={`glassmorphism rounded-2xl p-8 space-y-4 ${theme === 'dark' ? 'bg-gray-800 shadow-lg' : ''}`}>
              <h3 className={`font-semibold text-xl ${theme === 'dark' ? 'text-white' : ''}`}>The Integration Vision</h3>
              <p className={`text-muted-foreground text-lg ${theme === 'dark' ? 'text-gray-300' : ''}`}>
                From lot management to community building - Albert's got both covered.
                Your customers don't just buy cars, they live car life. Soon, you'll connect both sides of your business.
              </p>
              <Button
                asChild
                variant="outline"
                className="capsule-btn"
                data-testid="join-beta-button"
              >
                <a href="https://cargram.app" target="_blank" rel="noopener noreferrer">
                  <Users className="w-5 h-5" />
                  Join Beta Community
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Support & Real Testimonials Section */}
      <section id="support" className={`py-16 ${theme === 'dark' ? 'bg-gray-900' : ''}`} data-testid="support-section">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Real Testimonials & Success Stories */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className={`font-queen text-4xl lg:text-5xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
                  Proven Success Stories
                </h2>
                <p className={`text-xl ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                  Real dealers, real results. Our team has been moving metal and solving problems for dealers nationwide for years.
                </p>
              </div>

              {/* Real Testimonials */}
              <div className="space-y-6">
                <div className={`glassmorphism rounded-2xl p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-800 shadow-lg' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                      <Users className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={theme === 'dark' ? 'text-white font-semibold' : 'font-semibold'}>Cephas Maqowr</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'} mb-3`}>Verified Cargram Customer</p>
                      <p className={theme === 'dark' ? 'text-gray-300 italic' : 'text-muted-foreground italic'}>
                        "The team went above and beyond on a Friday evening when our internet went down...
                        the extra effort means the difference between making it and not being open"
                      </p>
                    </div>
                  </div>
                </div>

                <div className={`glassmorphism rounded-2xl p-6 space-y-4 ${theme === 'dark' ? 'bg-gray-800 shadow-lg' : ''}`}>
                  <div className="flex items-start space-x-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center">
                      <Building className="w-5 h-5 text-white" />
                    </div>
                    <div className="flex-1">
                      <h4 className={theme === 'dark' ? 'text-white font-semibold' : 'font-semibold'}>CMJ Motors</h4>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'} mb-3`}>Verified Cargram Customer</p>
                      <p className={theme === 'dark' ? 'text-gray-300 italic' : 'text-muted-foreground italic'}>
                        "The entire Cargram team... true professionals who consistently
                        monitor and update their system to topple the competition"
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Support Features */}
              <div className="space-y-4">
                {[
                  {
                    icon: Headphones,
                    title: "Friday Evening Support",
                    description: "Real support when you need it most - not just business hours.",
                    color: "text-green-500",
                  },
                  {
                    icon: TrendingUp,
                    title: "Constantly Evolving",
                    description: "Regular updates and improvements to stay ahead of the competition.",
                    color: "text-blue-500",
                  },
                  {
                    icon: MapPin,
                    title: "Nationwide Coverage",
                    description: "Serving hundreds of dealers coast to coast with local expertise.",
                    color: "text-orange-500",
                  },
                ].map((feature, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <feature.icon className={`w-5 h-5 ${feature.color}`} />
                    <div>
                      <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{feature.title}:</span>
                      <span className={`ml-2 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>{feature.description}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Contact CTA */}
              <div className="flex flex-col sm:flex-row gap-4" data-testid="contact-cta">
                <Button
                  variant="automotive"
                  size="xl"
                  className="capsule-btn"
                  data-testid="contact-sales-button"
                >
                  <Phone className="w-5 h-5" />
                  Get Cargram Demo
                </Button>
                <Button
                  variant="secondary"
                  size="xl"
                  className={`capsule-btn ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : ''}`}
                  data-testid="learn-more-button"
                >
                  <Info className="w-5 h-5" />
                  Success Stories
                </Button>
              </div>
            </div>

            {/* Company Focus */}
            <div className="flex justify-center" data-testid="support-visual">
              <div className={`glassmorphism rounded-3xl p-8 w-full max-w-md space-y-6 ${theme === 'dark' ? 'bg-gray-800 shadow-lg' : ''}`}>
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center mx-auto">
                    <Car className="w-10 h-10 text-white" />
                  </div>
                  <div>
                    <h3 className={`font-queen text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>Cargram</h3>
                    <p className={theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}>Automotive Software & Community</p>
                  </div>
                </div>

                <div className="space-y-4 text-sm">
                  <div className="space-y-2">
                    <h4 className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>What We Do:</h4>
                    <ul className={`space-y-1 ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                      <li>• Professional DMS for dealerships</li>
                      <li>• Mobile-first, lightning fast</li>
                      <li>• Complete integrations ecosystem</li>
                      <li>• Social automotive marketplace</li>
                      <li>• Connecting business + car culture</li>
                    </ul>
                  </div>

                  <div className={`rounded-xl p-4 ${theme === 'dark' ? 'bg-gray-700' : 'bg-secondary/50'}`}>
                    <h4 className={`font-semibold mb-2 ${theme === 'dark' ? 'text-white' : ''}`}>Our Vision:</h4>
                    <p className={`text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                      "Your customers don't just buy cars - they live car life.
                      We're connecting both sides of the automotive world."
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={`py-12 ${theme === 'dark' ? 'bg-gray-800/90' : 'bg-accent/50'}`} data-testid="footer">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Footer Brand */}
            <div className="space-y-4" data-testid="footer-brand">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className={`font-instagram text-2xl font-bold gradient-text ${theme === 'dark' ? 'text-white' : ''}`}>
                  Cargram
                </span>
              </div>
              <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-muted-foreground'}`}>
                The premier automotive community platform. Built by enthusiasts,
                for enthusiasts.
              </p>
              <div className="flex space-x-4">
                {[
                  { icon: Instagram, label: "Instagram", url: "https://instagram.com/cargram" },
                  { icon: Twitter, label: "Twitter", url: "https://twitter.com/cargram" },
                  { icon: Facebook, label: "Facebook", url: "https://facebook.com/cargram" },
                ].map((social, index) => (
                  <a
                    key={index}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 ${theme === 'dark' ? 'bg-gray-700 hover:bg-gray-600' : 'bg-secondary hover:bg-accent'} rounded-full flex items-center justify-center transition-colors`}
                    data-testid={`social-${social.label.toLowerCase()}`}
                    aria-label={`Visit our ${social.label} page`}
                  >
                    <social.icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Footer Links */}
            {[
              {
                title: "Platform",
                links: ["Features", "Community", "Mobile App", "API"],
              },
              {
                title: "Company",
                links: ["About Us", "Careers", "Contact", "Press"],
              },
              {
                title: "Legal",
                links: ["Privacy Policy", "Terms of Service", "Status"],
              },
            ].map((section, index) => (
              <div key={index} className="space-y-4" data-testid={`footer-section-${index}`}>
                <h3 className={`font-semibold ${theme === 'dark' ? 'text-white' : ''}`}>{section.title}</h3>
                <div className="space-y-2 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href={link === "Privacy Policy" ? "https://cargram.app/privacy" : "#"}
                      className={`block transition-colors ${theme === 'dark' ? 'text-gray-300 hover:text-white' : 'text-muted-foreground hover:text-foreground'}`}
                      data-testid={`footer-link-${link.toLowerCase().replace(' ', '-')}`}
                      {...(link === "Privacy Policy" ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={`border-t border-border mt-12 pt-8 text-center ${theme === 'dark' ? 'border-gray-700' : ''}`}>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-muted-foreground'}`}>
              © 2024 Cargram. All rights reserved. | Orange County, California
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}