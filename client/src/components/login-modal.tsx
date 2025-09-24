
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building, Users, ArrowRight, Sparkles } from "lucide-react";

interface LoginModalProps {
  theme: string;
}

export function LoginModal({ theme }: LoginModalProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={`
            relative overflow-hidden
            px-6 py-3 
            bg-gray-900 
            border-2 border-orange-500/60
            rounded-full
            font-semibold text-orange-400
            shadow-[inset_0_2px_4px_rgba(255,165,0,0.3),0_0_20px_rgba(255,165,0,0.4)]
            hover:shadow-[inset_0_4px_8px_rgba(255,165,0,0.4),0_0_30px_rgba(255,165,0,0.6)]
            active:shadow-[inset_0_6px_12px_rgba(255,165,0,0.5),0_0_15px_rgba(255,165,0,0.3)]
            active:translate-y-0.5
            transition-all duration-200 ease-out
            hover:scale-105 active:scale-95
            group
            ${theme === 'dark' ? 'bg-gray-800 border-orange-500/70' : ''}
          `}
          data-testid="login-modal-trigger"
        >
          <span className="relative z-10 text-transparent bg-gradient-to-r from-orange-400 to-orange-300 bg-clip-text font-bold tracking-wide">
            Login
          </span>
          
          {/* Inner glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 to-orange-400/10 rounded-full opacity-50 group-hover:opacity-70 transition-opacity" />
          
          {/* Sparkle effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <Sparkles className="absolute top-1 right-2 w-3 h-3 text-orange-300 animate-pulse" />
            <Sparkles className="absolute bottom-1 left-2 w-2 h-2 text-orange-400 animate-pulse delay-150" />
          </div>
        </button>
      </DialogTrigger>

      <DialogContent 
        className={`
          max-w-md p-0 overflow-hidden
          bg-gradient-to-br from-gray-900/95 to-gray-800/95
          backdrop-blur-xl
          border border-orange-500/30
          shadow-[0_0_50px_rgba(255,165,0,0.3)]
          ${theme === 'dark' ? 'bg-gradient-to-br from-gray-900/98 to-gray-800/98' : 'bg-gradient-to-br from-white/95 to-gray-50/95 border-orange-500/20'}
        `}
        data-testid="login-modal"
      >
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className={`text-2xl font-bold text-center ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Choose Your Platform
          </DialogTitle>
          <p className={`text-center text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
            Which Cargram experience would you like to access?
          </p>
        </DialogHeader>

        <div className="p-6 pt-2 space-y-4">
          {/* Cargram Social Option */}
          <a
            href="https://cargram.app"
            target="_blank"
            rel="noopener noreferrer"
            className={`
              group block w-full p-6 
              bg-gradient-to-r from-blue-600/20 to-purple-600/20
              border border-blue-500/30
              rounded-3xl
              hover:border-blue-400/50
              hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]
              transition-all duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
              ${theme === 'dark' ? 'hover:bg-gradient-to-r hover:from-blue-600/30 hover:to-purple-600/30' : 'bg-gradient-to-r from-blue-50 to-purple-50 hover:from-blue-100 hover:to-purple-100'}
            `}
            data-testid="social-login-option"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Users className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Cargram Social
                </h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Join the automotive community. Share your rides, connect with car enthusiasts, discover events.
                </p>
                <div className="flex items-center mt-3 text-blue-400 group-hover:text-blue-300 transition-colors">
                  <span className="text-sm font-medium">Enter Community</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>

          {/* Cargram DMS Option */}
          <a
            href="#dealer-signup"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("dealer-signup")?.scrollIntoView({
                behavior: "smooth",
              });
            }}
            className={`
              group block w-full p-6 
              bg-gradient-to-r from-orange-600/20 to-red-600/20
              border border-orange-500/30
              rounded-3xl
              hover:border-orange-400/50
              hover:shadow-[0_0_30px_rgba(251,146,60,0.3)]
              transition-all duration-300
              hover:scale-[1.02]
              active:scale-[0.98]
              ${theme === 'dark' ? 'hover:bg-gradient-to-r hover:from-orange-600/30 hover:to-red-600/30' : 'bg-gradient-to-r from-orange-50 to-red-50 hover:from-orange-100 hover:to-red-100'}
            `}
            data-testid="dms-login-option"
          >
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                <Building className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className={`font-bold text-lg mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  Cargram DMS
                </h3>
                <p className={`text-sm leading-relaxed ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                  Professional dealer management system. Mobile-first, lightning fast, built for moving metal.
                </p>
                <div className="flex items-center mt-3 text-orange-400 group-hover:text-orange-300 transition-colors">
                  <span className="text-sm font-medium">Get Demo Access</span>
                  <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          </a>

          {/* Existing Customer Note */}
          <div className={`text-center pt-4 border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
            <p className={`text-xs ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Existing customer? Click above to access your platform
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
