import { DEMO_PROFILES, type DemoProfile } from "@/data/demoProfiles";
import { ArrowRight, User } from "lucide-react";

interface DemoProfilesProps {
  onSelect: (profile: DemoProfile) => void;
}

export default function DemoProfiles({ onSelect }: DemoProfilesProps) {
  return (
    <div className="space-y-4 animate-fade-in">
      <div className="text-center mb-6">
        <h2 className="text-xl font-bold text-foreground mb-1">See BridgePath in Action</h2>
        <p className="text-sm text-muted-foreground">Choose a demo profile to see a personalized onboarding plan.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {DEMO_PROFILES.map((profile) => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile)}
            className="bp-card p-5 text-left hover:shadow-md transition-all group border-2 border-transparent hover:border-accent/30"
          >
            <div className="flex items-center gap-3 mb-3">
              <span className="text-4xl">{profile.avatar}</span>
              <div>
                <h3 className="font-bold text-foreground">{profile.name}, {profile.age}</h3>
                <p className="text-sm text-accent font-medium">{profile.tagline}</p>
                <p className="text-xs text-muted-foreground">{profile.origin}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3">{profile.story}</p>
            <div className="flex items-center gap-1.5 text-xs font-semibold text-accent group-hover:gap-2.5 transition-all">
              View {profile.name}'s Plan <ArrowRight size={12} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
