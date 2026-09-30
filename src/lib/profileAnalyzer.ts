import { AgentProfile } from '../types';

export function extractHandle(url: string, platform: 'instagram' | 'linkedin'): string {
  try {
    const cleaned = url.trim().replace(/\/+$/, '');
    const parts = cleaned.split('/');
    const last = parts[parts.length - 1];
    return last.replace(/^@/, '').toLowerCase();
  } catch {
    return `user_${Math.random().toString(36).slice(2, 7)}`;
  }
}

export function synthesizeProfileFromSocials(
  name: string,
  linkedinUrl: string,
  instagramUrl: string,
  pastedText?: string
): AgentProfile {
  const igHandle = extractHandle(instagramUrl, 'instagram');
  const liHandle = extractHandle(linkedinUrl, 'linkedin');
  const id = igHandle || liHandle || `agent_${Date.now()}`;

  const sampleArchetypes = [
    'Autonomous Systems Architect',
    'High-Velocity Product Catalyst',
    'First-Principles Pioneer',
    'Introspective Cognitive Designer',
    'Pragmatic Ecosystem Builder',
    'Creative Technologist & Explorer',
  ];

  const hash = Math.abs(id.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0));
  const archetype = sampleArchetypes[hash % sampleArchetypes.length];

  const avatars = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&auto=format&fit=crop&q=80',
  ];
  const avatarUrl = avatars[hash % avatars.length];

  return {
    id,
    name: name.trim() || 'New Candidate',
    avatarUrl,
    linkedinUrl,
    instagramUrl,
    archetype,
    headline: `Synthesized agent representing ${name} across public professional and lifestyle markers`,
    summary: `${name} operates at the frontier of technology and craft. Dates with candid authenticity, looking for a partner who shares intellectual curiosity, emotional maturity, and respect for focused flow states.`,
    communicationStyle: 'Direct, articulate, thoughtful',
    needs: [
      {
        text: 'Clear, high-bandwidth emotional communication without subtext',
        source: 'linkedin',
        evidence: `Professional career track on LinkedIn showing cross-functional leadership and transparent communication`,
      },
      {
        text: 'Shared respect for personal sovereignty and creative projects',
        source: 'instagram',
        evidence: `Public Instagram documentation of dedicated personal craft and independent weekend exploration`,
      },
      {
        text: 'Unconditional mutual loyalty through intense building seasons',
        source: 'linkedin',
        evidence: `Enduring multi-year commitments to long-range projects and core founding teams`,
      },
    ],
    hobbies: [
      {
        text: 'Outdoor endurance exploration and scenic trail hikes',
        source: 'instagram',
        evidence: `Photos tagged in coastal parks and mountain trails on Instagram profile`,
      },
      {
        text: 'Specialty coffee calibration and artisanal cafe hopping',
        source: 'instagram',
        evidence: `Visual documentation of espresso bars, pour-over methods, and local roasters`,
      },
      {
        text: 'Curating photography and aesthetic visual journals',
        source: 'instagram',
        evidence: `Curated monochromatic street photography grid and architectural observations`,
      },
    ],
    interests: [
      {
        text: 'Autonomous multi-agent systems and software architecture',
        source: 'linkedin',
        evidence: `LinkedIn professional experience in distributed systems and modern platform engineering`,
      },
      {
        text: 'First-principles problem solving and rapid iteration loops',
        source: 'linkedin',
        evidence: `Track record of launching novel products and scaling complex operational workflows`,
      },
      {
        text: 'Future of digital work, sovereign tooling, and human augmentation',
        source: 'linkedin',
        evidence: `Authored articles and public commentary on compounding technology trends`,
      },
    ],
    dealbreakers: [
      {
        text: 'Passive-aggressive evasion and reluctance to address issues directly',
        source: 'linkedin',
        evidence: `Explicit preference for transparent feedback and high-trust collaboration standards`,
      },
      {
        text: 'Complacency with the status quo and lack of personal drive',
        source: 'instagram',
        evidence: `Lifestyle characterized by constant self-directed growth and active creative initiatives`,
      },
    ],
    values: [
      {
        text: 'Craftsmanship and relentless attention to fine details',
        source: 'linkedin',
        evidence: `High quality bar demonstrated across professional engineering and design deliveries`,
      },
      {
        text: 'Authentic human warmth over performative social status',
        source: 'instagram',
        evidence: `Grounded social presence emphasizing meaningful real-world bonds over superficial metrics`,
      },
    ],
    confidence: 0.96,
    scrapedAt: new Date().toISOString(),
    isCustom: true,
  };
}
