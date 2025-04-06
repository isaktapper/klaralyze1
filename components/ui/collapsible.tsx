"use client";

import * as React from "react";

interface CollapsibleProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: React.ReactNode;
}

const Collapsible = ({ open, onOpenChange, children }: CollapsibleProps) => {
  const [isOpen, setIsOpen] = React.useState(open || false);
  
  React.useEffect(() => {
    if (open !== undefined) {
      setIsOpen(open);
    }
  }, [open]);

  const handleToggle = () => {
    const newState = !isOpen;
    setIsOpen(newState);
    onOpenChange?.(newState);
  };

  // Extract the trigger and content from children
  const childArray = React.Children.toArray(children);
  const trigger = childArray.find(
    (child) => React.isValidElement(child) && child.type === CollapsibleTrigger
  );
  const content = childArray.find(
    (child) => React.isValidElement(child) && child.type === CollapsibleContent
  );

  return (
    <div>
      {trigger && 
        React.cloneElement(trigger as React.ReactElement, {
          onClick: handleToggle,
        })
      }
      {isOpen && content}
    </div>
  );
};

interface CollapsibleTriggerProps {
  className?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

const CollapsibleTrigger = ({ 
  className, 
  onClick,
  children 
}: CollapsibleTriggerProps) => {
  return (
    <button
      type="button"
      className={className}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

interface CollapsibleContentProps {
  className?: string;
  children: React.ReactNode;
}

const CollapsibleContent = ({ 
  className, 
  children 
}: CollapsibleContentProps) => {
  return (
    <div className={className}>
      {children}
    </div>
  );
};

Collapsible.displayName = "Collapsible";
CollapsibleTrigger.displayName = "CollapsibleTrigger";
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
