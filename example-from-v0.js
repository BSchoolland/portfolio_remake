"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowDown, Github, Linkedin, Mail } from "lucide-react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 gradient-bg" />

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse delay-1000" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div
          className={`text-center transition-all duration-1000 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-6 text-balance">
            Hi, I'm <span className="gradient-text">Alex Chen</span>
          </h1>

          <p className="text-xl sm:text-2xl lg:text-3xl text-muted-foreground mb-8 text-balance">
            Full Stack Developer & Digital Craftsman
          </p>

          <p className="text-lg text-muted-foreground mb-12 max-w-2xl mx-auto text-pretty">
            I create exceptional digital experiences through clean code, innovative solutions, and a passion for
            cutting-edge technologies. From React frontends to scalable backends, I bring ideas to life.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              View My Work
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent"
            >
              Download Resume
            </Button>
          </div>

          <div className="flex justify-center space-x-6 mb-12">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Github className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Linkedin className="h-6 w-6" />
            </a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors duration-200">
              <Mail className="h-6 w-6" />
            </a>
          </div>

          <div className="animate-bounce">
            <ArrowDown className="h-6 w-6 mx-auto text-muted-foreground" />
          </div>
        </div>
      </div>
    </section>
  )
}
