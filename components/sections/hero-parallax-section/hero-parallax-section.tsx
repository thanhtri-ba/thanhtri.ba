"use client";
import React from "react";
import { HeroParallax } from "@/components/effects/hero-parallax";

export default function HeroParallaxDemo() {
  return <HeroParallax products={products} />;
}
export const products = [
  {
    title: "KodaiRateIQ",
    link: "https://kodai-rate-iq.vercel.app/",
    thumbnail: "/KodairateIQ.avif",
    objectPosition: "left top",
  },
  {
    title: "ProofStack",
    link: "#",
    thumbnail: "/Proofstack-1.avif",
    objectPosition: "left top",
  },
  {
    title: "CyberShield India",
    link: "#",
    thumbnail: "/cybershield-1.avif",
    objectPosition: "left top",
  },

  {
    title: "Old Portfolio",
    link: "https://portfolio-wheat-zeta-18.vercel.app",
    thumbnail: "/oldportfolio-1.avif",
    objectPosition: "left top",
  },
  {
    title: "Ridershield",
    link: "#",
    thumbnail: "/Ridershield-1.avif",
    objectPosition: "center top",
  },
  {
    title: "Quiz Website",
    link: "https://iac-quiz-website.vercel.app",
    thumbnail: "/Quizwebsite-1.avif",
    objectPosition: "left top",
  },

  {
    title: "RiderShieldPlan",
    link: "https://rider-shield-plan.vercel.app",
    thumbnail: "/Ridershieldplan-1.avif",
  },
  {
    title: "Cinematch",
    link: "https://cine-match-h8u71tvrb-dharsanhunts-projects.vercel.app/",
    thumbnail: "/Cinematch-1.avif",
  },
  {
    title: "WeatherApp",
    link: "https://ambientweatherapp.netlify.app",
    thumbnail: "/weatherapp-1.avif",
    objectPosition: "left top",
  },
  {
    title: "Gas Safety Dashboard",
    link: "https://github.com/DharsanHunt/gas-safety-dashboard.git",
    thumbnail: "/safetydashboard-1.avif",
    objectPosition: "left top",
  },
  {
    title: "Sentinel",
    link: "#",
    thumbnail: "/sentinal-1.avif",
    objectPosition: "left top",
  },

  {
    title: "Sentry",
    link: "#",
    thumbnail: "/Sentryx-1.avif",
  },
  {
    title: "Golden Bells Academy",
    link: "https://goldenbellsacademy.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/goldenbellsacademy.png",
  },
  {
    title: "Invoker Labs",
    link: "https://invoker.lol",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/invoker.png",
  },
  {
    title: "E Free Invoice",
    link: "https://efreeinvoice.com",
    thumbnail:
      "https://aceternity.com/images/products/thumbnails/new/efreeinvoice.png",
  },
];
