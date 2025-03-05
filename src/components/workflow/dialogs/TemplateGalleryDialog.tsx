import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { WORKFLOW_TEMPLATES } from "../constants";

interface TemplateGalleryDialogProps {
  children: React.ReactNode;
  onSelectTemplate: (templateId: string) => void;
}

const TemplateGalleryDialog: React.FC<TemplateGalleryDialogProps> = ({
  children,
  onSelectTemplate,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = Array.from(
    new Set(WORKFLOW_TEMPLATES.map((template) => template.category))
  );

  const filteredTemplates = WORKFLOW_TEMPLATES.filter((template) => {
    const matchesSearch =
      searchTerm === "" ||
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === null || template.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const handleSelectTemplate = (templateId: string) => {
    onSelectTemplate(templateId);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Workflow Templates</DialogTitle>
          <DialogDescription>
            Choose a template to start your workflow
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-4 mt-4">
          <div className="w-1/4">
            <Label className="mb-2 block">Categories</Label>
            <div className="space-y-1">
              <div
                className={`px-2 py-1 rounded-sm cursor-pointer ${
                  selectedCategory === null
                    ? "bg-primary text-primary-foreground"
                    : "hover:bg-accent"
                }`}
                onClick={() => setSelectedCategory(null)}
              >
                All Categories
              </div>
              {categories.map((category) => (
                <div
                  key={category}
                  className={`px-2 py-1 rounded-sm cursor-pointer ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "hover:bg-accent"
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </div>
              ))}
            </div>
          </div>

          <Separator orientation="vertical" />

          <div className="w-3/4 space-y-4">
            <Input
              placeholder="Search templates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="grid grid-cols-2 gap-4 max-h-[400px] overflow-y-auto pr-2">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="border rounded-md p-4 hover:border-primary cursor-pointer"
                  onClick={() => handleSelectTemplate(template.id)}
                >
                  <h3 className="font-medium text-lg">{template.name}</h3>
                  <p className="text-muted-foreground text-sm mb-2">
                    {template.description}
                  </p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      {template.category}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleSelectTemplate(template.id);
                      }}
                    >
                      Use Template
                    </Button>
                  </div>
                </div>
              ))}

              {filteredTemplates.length === 0 && (
                <div className="col-span-2 text-center py-8 text-muted-foreground">
                  No templates found matching your criteria.
                </div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateGalleryDialog;
