import { createClient } from '@supabase/supabase-js'
import * as dotenv from 'dotenv'
import * as path from 'path'

// Load env vars
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') })

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials in .env.local')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function seed() {
  console.log('Seeding Supabase data...')

  // 1. Resume
  const { error: resumeError } = await supabase
    .from('resume')
    .insert([
      {
        full_name: 'Idham Yazim',
        role: 'Senior Executive / Performance Digital Marketing',
        email: 'idhamyazim1234@yahoo.com',
        phone: '010-958-2051',
        location: 'Shah Alam, Selangor',
        summary: 'Dynamic digital marketer adept at crafting and implementing innovative strategies for brand growth. Proficient in SEO, social media, email marketing, and PPC. Skilled in data analysis and ROI optimization. Seeking Digital Marketing Executive role to drive impactful campaigns and contribute to team success with creativity and expertise.',
        experience: [
          {
            company: "InoGlo Custom Apparel",
            role: "Digital Marketing Specialist",
            period: "Nov 2023 - Current",
            desc: [
              "Experienced in crafting impactful campaign ads to drive team sales growth.",
              "Proficient in ideating engaging content for ads and daily social media engagement.",
              "Proficient in managing social media platforms (Facebook, Instagram, TikTok, LinkedIn, Twitter), WordPress, and Google Analytics.",
              "Skilled in managing social media and Google Ads campaigns.",
              "Proficient in utilizing Niagawan for monitoring team sales metrics.",
              "Proficient in designing WordPress websites, specializing in creating engaging landing pages."
            ]
          },
          {
            company: "Sahabat Insaff Ventures Sdn Bhd",
            role: "Digital Marketing Executive",
            period: "Dec 2020 - Oct 2023",
            desc: [
              "Proficient in crafting compelling campaign ads for clients.",
              "Experienced in ideating creative content ideas tailored to client needs.",
              "Proficient in managing Facebook, Instagram, and TikTok ad campaigns for clients.",
              "Experienced in collaborating with clients to strategize and enhance campaign effectiveness.",
              "Proficient in editing designs using Canva and AI tools.",
              "Proficient in designing and developing WordPress websites."
            ]
          }
        ],
        projects: [
          {"title": "theowlofficial.com", "niche": "Local Streetwear"},
          {"title": "Samsara Travel Agency", "niche": "Travel Agency"},
          {"title": "Tailor Elite Pro", "niche": "Custom Workwear"},
          {"title": "Petra Construction", "niche": "Construction"},
          {"title": "Sales Advisor Astro", "niche": "Retail Product"},
          {"title": "Lepakmamak", "niche": "News, Website"}
        ],
        skills: ["Social Media Management", "Paid Advertising (Meta, TikTok)", "Marketing Strategy", "Website Design", "Google Analytics", "Email Marketing", "Copywriting", "E-commerce Management"],
        education: [
          {"school": "CENTRE FOR FOUNDATION STUDIES IIUM", "degree": "Foundation Engineering", "period": ""},
          {"school": "MRSM TRANSKRIAN", "degree": "High School", "period": "2009 - 2010"}
        ]
      }
    ])

  if (resumeError) console.error('Error seeding resume:', resumeError)
  else console.log('Resume seeded successfully')

  // 2. Projects
  const { error: projectsError } = await supabase
    .from('projects')
    .insert([
      {
        title: 'theowlofficial.com',
        description: 'Managed Facebook and TikTok ads, content strategy, and website management for a local streetwear brand.',
        category: 'E-commerce',
        tech_stack: ['Meta Ads', 'TikTok Ads', 'WordPress', 'Shopify'],
        status: 'Live',
        progress: 100,
        live_url: 'https://theowlofficial.com'
      },
      {
        title: 'Samsara Travel Agency',
        description: 'Managed Facebook Ads and created promotional content specifically for travel agency lead generation.',
        category: 'Marketing',
        tech_stack: ['Facebook Ads', 'Canva', 'Analytics'],
        status: 'Live',
        progress: 100
      },
      {
        title: 'Tailor Elite Pro',
        description: 'Optimized ad performance metrics (CTR, CPC) and scheduled social media posts for local tailoring business.',
        category: 'Marketing',
        tech_stack: ['Facebook Ads', 'Social Media', 'Content Strategy'],
        status: 'Live',
        progress: 100
      }
    ])

  if (projectsError) console.error('Error seeding projects:', projectsError)
  else console.log('Projects seeded successfully')

  // 3. Skills
  const { error: skillsError } = await supabase
    .from('skills')
    .insert([
      { name: 'Meta Ads', category: 'Paid Advertising', level: 95 },
      { name: 'TikTok Ads', category: 'Paid Advertising', level: 90 },
      { name: 'WordPress', category: 'Website Design', level: 90 },
      { name: 'Google Analytics', category: 'Data Analysis', level: 85 }
    ])

  if (skillsError) console.error('Error seeding skills:', skillsError)
  else console.log('Skills seeded successfully')

  console.log('Seeding complete!')
}

seed()
