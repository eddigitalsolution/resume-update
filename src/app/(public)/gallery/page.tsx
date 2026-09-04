import { createClient } from "@/lib/supabase-server";
import { GalleryItem } from "@/types";
import { GalleryShowcase } from "@/components/portfolio/GalleryShowcase";

export const revalidate = 60;

export default async function GalleryPage() {
  let items: GalleryItem[] = [];
  let isMock = false;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("gallery")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }
    items = data || [];
  } catch (err) {
    console.warn("Gallery database table not found, displaying highly curated mock showcase items instead:", err);
    isMock = true;
    items = [
      {
        id: "mock-1",
        title: "Neon Cyberpunk Landing Page Mockup",
        description: "An AI-generated, high-fidelity dark-mode landing page designed for a local streetwear e-commerce campaign.",
        image_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1200&auto=format&fit=crop",
        prompt: "modern dark mode landing page for streetwear brand, neon purple and toxic green neon lines, glassmorphism UI cards, 3d assets, extremely premium, high resolution, figma style --ar 16:9",
        type: "AI Image",
        created_at: new Date().toISOString()
      },
      {
        id: "mock-2",
        title: "Omnichannel CRM Wireframe",
        description: "Custom UI/UX layout concept designed for a high-converting WhatsApp automation dashboard.",
        image_url: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?q=80&w=1200&auto=format&fit=crop",
        prompt: "clean minimalist dashboard UI mockup, analytics cards, chat list panel on the left, dark mode theme with neon blue accents, high resolution, modern dashboard --ar 16:9",
        type: "Design",
        created_at: new Date().toISOString()
      },
      {
        id: "mock-3",
        title: "Video Ads Storyboard Keyframes",
        description: "Screenshot from a high-impact promotional video campaign highlighting automated business messaging.",
        image_url: "https://images.unsplash.com/photo-1626544827763-d516dce335e2?q=80&w=1200&auto=format&fit=crop",
        prompt: "cinematic corporate video still, professional editor interface showing a tech startup demo, warm lighting, futuristic UI elements overlaid --ar 16:9",
        type: "Video SS",
        created_at: new Date().toISOString()
      },
      {
        id: "mock-4",
        title: "Futuristic Glassmorphic App Interface",
        description: "Visual design for a luxury crypto wallet application displaying vibrant gradients and frosted glass aesthetics.",
        image_url: "https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?q=80&w=1200&auto=format&fit=crop",
        prompt: "frosted glassmorphism app screens, floating colorful transparent gradient circles behind, clean typography, luxury design system, iOS style, 8k render --ar 9:16",
        type: "AI Image",
        created_at: new Date().toISOString()
      },
      {
        id: "mock-5",
        title: "Fitness App Dashboard Mockup",
        description: "High fidelity custom screen wireframe mapping workout routines, metrics tracking, and progress metrics.",
        image_url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?q=80&w=1200&auto=format&fit=crop",
        prompt: "fitness dashboard mobile UI design, clean orange and dark gray theme, elegant active lifestyle widgets, activity rings, flat modern graphics, high res --ar 9:16",
        type: "Design",
        created_at: new Date().toISOString()
      },
      {
        id: "mock-6",
        title: "E-Commerce Promotional Video Snippet",
        description: "A frame showing custom streetwear overlay and visual effect mapping for a social media short-form video.",
        image_url: "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop",
        prompt: "professional gaming content video still, neon game controllers, fast paced video sequence edits, highly vibrant purple and red color grade --ar 16:9",
        type: "Video SS",
        created_at: new Date().toISOString()
      }
    ];
  }

  return (
    <main className="min-h-screen pt-32 pb-24 bg-black relative overflow-hidden">
      {/* Dynamic ambient backdrop light */}
      <div className="absolute top-0 left-1/4 w-125 h-125 bg-purple-500/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-100 h-100 bg-indigo-500/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-linear-to-r from-purple-500/10 to-indigo-500/10 border border-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest">
             <div className="h-1.5 w-1.5 rounded-full bg-purple-500 animate-pulse shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
             Creative Lab
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-none">
            Showcase <span className="bg-clip-text text-transparent bg-linear-to-r from-purple-400 via-indigo-400 to-blue-400">Gallery</span>
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-xl mx-auto leading-relaxed">
             A curation of AI-assisted art, digital landing page mockups, visual media storyboards, and their underlying prompts.
          </p>
        </div>

        {/* Gallery Showcase Interactive Client Component */}
        <GalleryShowcase initialItems={items} isMock={isMock} />
      </div>
    </main>
  );
}
