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
  Sun,
  Moon,
  Rocket,
  Mail,
  Users,
  Calendar,
  MapPin,
  Heart,
  Share2,
  Camera,
  TrendingUp,
  ShieldCheck,
  Zap,
  Handshake,
  Target,
  Clock,
  Building,
  Headphones,
  Phone,
  Info,
  Instagram,
  Twitter,
  Facebook,
  Send,
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Header Navigation */}
      <header className="fixed top-0 left-0 right-0 z-50 header-glassmorphism">
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
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-features"
              >
                Features
              </a>
              <a
                href="#community"
                className="text-muted-foreground hover:text-foreground transition-colors"
                data-testid="nav-community"
              >
                Community
              </a>
              <a
                href="#support"
                className="text-muted-foreground hover:text-foreground transition-colors"
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
                className="capsule-btn"
                data-testid="theme-toggle"
              >
                {theme === "light" ? (
                  <Moon className="w-5 h-5" />
                ) : (
                  <Sun className="w-5 h-5" />
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
      <section className="hero-gradient text-white pt-24 pb-16 min-h-screen flex items-center relative overflow-hidden">
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
                <h1 className="font-queen text-5xl lg:text-7xl font-bold leading-tight text-white">
                  Welcome to
                  <span className="font-instagram block text-transparent bg-gradient-to-r from-blue-300 to-orange-300 bg-clip-text">
                    Cargram
                  </span>
                </h1>
                <p className="text-xl lg:text-2xl text-blue-100 max-w-lg font-medium">
                  The ultimate automotive community where passion meets
                  technology. Connect, share, and discover with fellow car
                  enthusiasts worldwide.
                </p>
              </div>

              {/* Hero Stats */}
              <div className="flex flex-wrap gap-8 text-sm" data-testid="hero-stats">
                <div className="flex items-center space-x-2">
                  <Users className="w-5 h-5 text-orange-400" />
                  <span>50K+ Members</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-orange-400" />
                  <span>12+ Years Experience</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5 text-orange-400" />
                  <span>Orange County, CA</span>
                </div>
              </div>

              {/* Hero Actions */}
              <div className="flex flex-col sm:flex-row gap-4" data-testid="hero-actions">
                <Button
                  asChild
                  variant="orange"
                  size="xl"
                  className="capsule-btn"
                  data-testid="join-community-button"
                >
                  <a href="https://cargram.app" target="_blank" rel="noopener noreferrer">
                    <Rocket className="w-5 h-5" />
                    Join Community
                  </a>
                </Button>
                <Button
                  onClick={scrollToForm}
                  variant="outline"
                  size="xl"
                  className="capsule-btn bg-white/10 hover:bg-white/20 text-white border-white/20"
                  data-testid="get-updates-button"
                >
                  <Mail className="w-5 h-5" />
                  Get Updates
                </Button>
              </div>
            </div>

            {/* Hero Visual */}
            <div className="flex justify-center lg:justify-end" data-testid="hero-visual">
              <div className="relative">
                {/* Modern phone mockup with iframe */}
                <div className="w-80 max-w-full h-[640px] bg-gray-900 rounded-[3rem] p-2 shadow-2xl float-animation sm:scale-100 scale-75 origin-center">
                  <div className="w-full h-full bg-black rounded-[2.5rem] overflow-hidden relative">
                    {/* Phone notch/status bar */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-10"></div>

                    {/* Loading state */}
                    {!iframeLoaded && !iframeError && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center text-white z-20">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4">
                          <Car className="w-10 h-10 text-blue-600 animate-pulse" />
                        </div>
                        <h3 className="font-instagram text-lg font-bold mb-2">Cargram</h3>
                        <p className="text-blue-100 text-sm">Loading live preview...</p>
                      </div>
                    )}

                    {/* Error fallback */}
                    {iframeError && (
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-700 flex flex-col items-center justify-center text-white z-20">
                        <div className="w-16 h-16 bg-white rounded-3xl flex items-center justify-center mb-4">
                          <Car className="w-10 h-10 text-blue-600" />
                        </div>
                        <h3 className="font-instagram text-lg font-bold mb-2">Cargram</h3>
                        <p className="text-blue-100 text-sm text-center px-4">
                          Your automotive social hub
                        </p>
                        <div className="space-y-3 w-full px-8 mt-6">
                          <div className="h-2 bg-white/20 rounded-full"></div>
                          <div className="h-2 bg-white/30 rounded-full w-3/4"></div>
                          <div className="h-2 bg-white/10 rounded-full w-1/2"></div>
                        </div>
                      </div>
                    )}

                    {/* Iframe */}
                    <iframe
                      src="https://cargram.app"
                      className="w-full h-full border-0 rounded-[2.5rem]"
                      style={{ 
                        transform: 'scale(0.85)',
                        transformOrigin: 'top left',
                        width: '117.6%',
                        height: '117.6%'
                      }}
                      onLoad={() => {
                        setIframeLoaded(true);
                        setIframeError(false);
                      }}
                      onError={() => {
                        setIframeError(true);
                        setIframeLoaded(false);
                      }}
                      data-testid="cargram-app-iframe"
                      title="Cargram App Preview"
                      loading="lazy"
                      referrerPolicy="no-referrer"
                      sandbox="allow-same-origin allow-scripts allow-forms allow-popups-to-escape-sandbox"
                      allow="clipboard-write; autoplay"
                    />
                  </div>
                </div>

                {/* Floating elements */}
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Heart className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <Share2 className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Lead Capture Form Section */}
      <section id="lead-form" className="py-16 bg-secondary/50" data-testid="lead-capture-section">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center">
            <div className="glassmorphism rounded-3xl p-8 space-y-6">
              <div className="space-y-4">
                <h2 className="font-queen text-3xl lg:text-4xl font-bold">
                  Stay in the Fast Lane
                </h2>
                <p className="text-muted-foreground text-lg">
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
                              className="form-input"
                              data-testid="input-email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
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
                      <Send className="w-5 h-5" />
                      {subscriptionMutation.isPending ? "Subscribing..." : "Subscribe"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    No spam, unsubscribe at any time. We respect your privacy.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16" data-testid="features-section">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-queen text-4xl lg:text-5xl font-bold mb-6">
              Why Choose Cargram?
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Built by automotive enthusiasts, for automotive enthusiasts.
              Experience the difference that 12+ years of industry expertise
              makes.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature Cards */}
            {[
              {
                icon: Users,
                title: "Authentic Community",
                description:
                  "Connect with real car enthusiasts, not bots. Our verified community ensures genuine automotive conversations and connections.",
                gradient: "from-primary to-blue-600",
              },
              {
                icon: Camera,
                title: "Showcase Your Build",
                description:
                  "Share your automotive journey with high-quality photo sharing, build documentation, and modification tracking.",
                gradient: "from-orange-500 to-red-500",
              },
              {
                icon: TrendingUp,
                title: "Industry Insights",
                description:
                  "Stay ahead with market trends, new releases, and expert analysis from our 12+ years in the automotive industry.",
                gradient: "from-green-500 to-emerald-600",
              },
              {
                icon: MapPin,
                title: "Local Events",
                description:
                  "Discover car shows, meetups, and automotive events in your area. Connect offline with your online community.",
                gradient: "from-purple-500 to-indigo-600",
              },
              {
                icon: ShieldCheck,
                title: "Safe & Secure",
                description:
                  "Your data and privacy are protected with enterprise-grade security. Focus on your passion, not privacy concerns.",
                gradient: "from-pink-500 to-rose-600",
              },
              {
                icon: Zap,
                title: "Lightning Fast",
                description:
                  "Built with modern technology for instant loading and smooth interactions. No more waiting for your content to load.",
                gradient: "from-yellow-500 to-orange-500",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glassmorphism rounded-2xl p-8 space-y-6 hover-scale transition-transform duration-200"
                data-testid={`feature-card-${index}`}
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl flex items-center justify-center`}
                >
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <div className="space-y-3">
                  <h3 className="font-semibold text-xl">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Ideology Section */}
      <section
        id="community"
        className="py-16 bg-gradient-to-br from-primary/5 to-orange-500/5"
        data-testid="community-section"
      >
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center space-y-12">
            <div className="space-y-6">
              <h2 className="font-queen text-4xl lg:text-5xl font-bold">
                Our Automotive Philosophy
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed">
                At Cargram, we believe that every car has a story, every
                modification has meaning, and every enthusiast deserves a
                platform to share their passion. We're not just building an app
                – we're cultivating a culture.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {[
                {
                  icon: Heart,
                  title: "Passion First",
                  description:
                    "We understand that cars aren't just transportation – they're extensions of personality, dreams made tangible, and art in motion. Every feature we build honors this passion.",
                  color: "text-red-500",
                },
                {
                  icon: Handshake,
                  title: "Community Driven",
                  description:
                    "Real enthusiasts helping real enthusiasts. Our platform facilitates authentic connections, knowledge sharing, and mutual respect among car lovers worldwide.",
                  color: "text-blue-500",
                },
                {
                  icon: Target,
                  title: "Quality Over Quantity",
                  description:
                    "We prioritize meaningful interactions over vanity metrics. Every tool, every feature, every update is designed to enhance your automotive journey.",
                  color: "text-green-500",
                },
                {
                  icon: Clock,
                  title: "Legacy Mindset",
                  description:
                    "With 12+ years in the industry, we're not chasing trends – we're setting them. We build for the long haul, just like the classic cars we admire.",
                  color: "text-purple-500",
                },
              ].map((ideology, index) => (
                <div
                  key={index}
                  className="glassmorphism rounded-2xl p-8 text-left space-y-4"
                  data-testid={`ideology-card-${index}`}
                >
                  <div className="flex items-center space-x-3 mb-4">
                    <ideology.icon className={`w-6 h-6 ${ideology.color}`} />
                    <h3 className="font-semibold text-xl">{ideology.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{ideology.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Support & Dealer Management Section */}
      <section id="support" className="py-16" data-testid="support-section">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Support Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h2 className="font-queen text-4xl lg:text-5xl font-bold">
                  Enterprise Solutions
                </h2>
                <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                  Beyond our community platform, we provide comprehensive dealer
                  management software and automotive business solutions across
                  Orange County and beyond. We collect and use your data solely
                  to enhance your automotive community experience, connect you
                  with relevant content, and improve our services.
                </p>
              </div>

              {/* Support Features */}
              <div className="space-y-6">
                {[
                  {
                    icon: Building,
                    title: "Dealer Management Software",
                    description:
                      "Streamline inventory, sales, and customer relationships with our industry-leading DMS solutions.",
                    color: "text-primary",
                    bgColor: "bg-primary/10",
                  },
                  {
                    icon: MapPin,
                    title: "Orange County Expertise",
                    description:
                      "Deep local market knowledge with 12+ years serving Southern California's automotive industry.",
                    color: "text-orange-500",
                    bgColor: "bg-orange-500/10",
                  },
                  {
                    icon: Headphones,
                    title: "24/7 Support",
                    description:
                      "Round-the-clock technical support ensuring your business never misses a beat.",
                    color: "text-green-500",
                    bgColor: "bg-green-500/10",
                  },
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-4"
                    data-testid={`support-feature-${index}`}
                  >
                    <div
                      className={`w-12 h-12 ${feature.bgColor} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <feature.icon className={`w-6 h-6 ${feature.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {feature.description}
                      </p>
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
                  Contact Sales
                </Button>
                <Button
                  variant="secondary"
                  size="xl"
                  className="capsule-btn"
                  data-testid="learn-more-button"
                >
                  <Info className="w-5 h-5" />
                  Learn More
                </Button>
              </div>
            </div>

            {/* Support Visual - Dashboard Mockup */}
            <div className="flex justify-center" data-testid="support-visual">
              <div className="glassmorphism rounded-3xl p-8 w-full max-w-md">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">Dealer Dashboard</h3>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>

                  {/* Mock data visualization */}
                  <div className="space-y-4">
                    {[
                      { label: "Monthly Sales", value: "$2.4M", width: "w-3/4" },
                      { label: "Inventory Turnover", value: "18 days", width: "w-5/6" },
                      { label: "Customer Satisfaction", value: "98%", width: "w-full" },
                    ].map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">
                            {stat.label}
                          </span>
                          <span className="font-semibold">{stat.value}</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`${
                              index === 0
                                ? "bg-primary"
                                : index === 1
                                ? "bg-green-500"
                                : "bg-orange-500"
                            } h-2 rounded-full ${stat.width}`}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Mock recent activity */}
                  <div className="space-y-3">
                    <h4 className="font-medium text-sm text-muted-foreground">
                      Recent Activity
                    </h4>
                    <div className="space-y-2">
                      {[
                        {
                          icon: Car,
                          title: "2024 Model S sold",
                          time: "2 minutes ago",
                          color: "text-blue-500",
                          bgColor: "bg-blue-500/10",
                        },
                        {
                          icon: Users,
                          title: "New customer registered",
                          time: "5 minutes ago",
                          color: "text-green-500",
                          bgColor: "bg-green-500/10",
                        },
                      ].map((activity, index) => (
                        <div
                          key={index}
                          className="flex items-center space-x-3"
                          data-testid={`activity-${index}`}
                        >
                          <div
                            className={`w-8 h-8 ${activity.bgColor} rounded-full flex items-center justify-center`}
                          >
                            <activity.icon
                              className={`w-4 h-4 ${activity.color}`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">
                              {activity.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {activity.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-accent/50 py-12" data-testid="footer">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            {/* Footer Brand */}
            <div className="space-y-4" data-testid="footer-brand">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-br from-primary to-orange-500 rounded-2xl flex items-center justify-center">
                  <Car className="w-6 h-6 text-white" />
                </div>
                <span className="font-instagram text-2xl font-bold gradient-text">
                  Cargram
                </span>
              </div>
              <p className="text-muted-foreground text-sm">
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
                    className="w-10 h-10 bg-secondary hover:bg-accent rounded-full flex items-center justify-center transition-colors"
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
                <h3 className="font-semibold">{section.title}</h3>
                <div className="space-y-2 text-sm">
                  {section.links.map((link, linkIndex) => (
                    <a
                      key={linkIndex}
                      href="#"
                      className="block text-muted-foreground hover:text-foreground transition-colors"
                      data-testid={`footer-link-${link.toLowerCase().replace(' ', '-')}`}
                    >
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center">
            <p className="text-sm text-muted-foreground">
              © 2024 Cargram. All rights reserved. | Orange County, California
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}