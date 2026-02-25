import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Plus, X } from "lucide-react";

interface Props {
  onRoleCreated: () => void;
}

export default function AddRoleDialog({ onRoleCreated }: Props) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const addSkill = () => {
    const skill = skillInput.trim().toLowerCase();
    if (skill && !skills.includes(skill)) {
      setSkills([...skills, skill]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = async () => {
    if (!title.trim() || skills.length === 0) {
      toast({ title: "Missing fields", description: "Title and at least one skill are required.", variant: "destructive" });
      return;
    }

    setSaving(true);
    const { error } = await supabase.from("job_roles").insert({
      title: title.trim(),
      description: description.trim() || null,
      category: category.trim() || "Custom",
      required_skills: skills,
      user_id: user?.id,
    } as any);

    if (error) {
      toast({ title: "Failed to save", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Role created!", description: `"${title}" has been added.` });
      setTitle("");
      setDescription("");
      setCategory("");
      setSkills([]);
      setOpen(false);
      onRoleCreated();
    }
    setSaving(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-1">
          <Plus className="h-4 w-4" /> Add Custom Role
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Create Custom Job Role</DialogTitle>
          <DialogDescription>Define your own target role with required skills</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="space-y-2">
            <Label>Role Title *</Label>
            <Input placeholder="e.g. Data Platform Engineer" value={title} onChange={(e) => setTitle(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <Textarea placeholder="Brief description of the role..." value={description} onChange={(e) => setDescription(e.target.value)} className="resize-none h-20" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Input placeholder="e.g. Engineering, Data, AI/ML" value={category} onChange={(e) => setCategory(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Required Skills *</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Type a skill and press Add"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              />
              <Button type="button" variant="secondary" onClick={addSkill} size="sm">Add</Button>
            </div>
            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill) => (
                <Badge key={skill} variant="secondary" className="gap-1 pr-1">
                  {skill}
                  <button onClick={() => removeSkill(skill)} className="hover:bg-muted rounded-full p-0.5">
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {skills.length === 0 && <p className="text-xs text-muted-foreground">Add at least one required skill</p>}
          </div>
          <Button onClick={handleSave} disabled={saving || !title.trim() || skills.length === 0} className="w-full">
            {saving ? "Saving..." : "Create Role"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
