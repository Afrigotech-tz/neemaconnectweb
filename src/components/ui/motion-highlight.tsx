import * as React from "react";
import { AnimatePresence, motion, type Transition } from "framer-motion";
import { cn } from "@/lib/utils";

type MotionHighlightMode = "children" | "parent";

interface Bounds {
  top: number;
  left: number;
  width: number;
  height: number;
}

interface MotionHighlightContextValue {
  mode: MotionHighlightMode;
  activeValue: string | null;
  setActiveValue: (value: string | null) => void;
  id: string;
  hover: boolean;
  className?: string;
  activeClassName?: string;
  setActiveClassName: (className: string) => void;
  transition: Transition;
  disabled?: boolean;
  enabled?: boolean;
  exitDelay?: number;
  setBounds: (bounds: DOMRect) => void;
  clearBounds: () => void;
}

const MotionHighlightContext = React.createContext<MotionHighlightContextValue | undefined>(undefined);

const useMotionHighlightContext = () => {
  const context = React.useContext(MotionHighlightContext);
  if (!context) {
    throw new Error("MotionHighlightItem must be used inside MotionHighlight.");
  }
  return context;
};

export interface MotionHighlightProps extends React.ComponentProps<"div"> {
  mode?: MotionHighlightMode;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
  transition?: Transition;
  hover?: boolean;
  disabled?: boolean;
  enabled?: boolean;
  exitDelay?: number;
  controlledItems?: boolean;
  itemsClassName?: string;
  containerClassName?: string;
  boundsOffset?: Partial<Bounds>;
}

export interface MotionHighlightItemProps extends React.ComponentProps<"div"> {
  value?: string;
  activeClassName?: string;
  disabled?: boolean;
  transition?: Transition;
  exitDelay?: number;
}

const DEFAULT_TRANSITION: Transition = { type: "spring", stiffness: 350, damping: 35 };

export const MotionHighlight = React.forwardRef<HTMLDivElement, MotionHighlightProps>(
  (
    {
      children,
      mode = "children",
      value,
      defaultValue = null,
      onValueChange,
      className,
      transition = DEFAULT_TRANSITION,
      hover = false,
      disabled = false,
      enabled = true,
      exitDelay = 0.2,
      controlledItems = false,
      itemsClassName,
      containerClassName,
      boundsOffset,
      ...props
    },
    ref
  ) => {
    const localRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    const [activeValue, setActiveValueState] = React.useState<string | null>(value ?? defaultValue);
    const [activeClassName, setActiveClassName] = React.useState<string>("");
    const [boundsState, setBoundsState] = React.useState<Bounds | null>(null);
    const id = React.useId();

    const setActiveValue = React.useCallback(
      (next: string | null) => {
        if (value === undefined) {
          setActiveValueState(next);
        }
        onValueChange?.(next);
      },
      [onValueChange, value]
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setActiveValueState(value);
      }
    }, [value]);

    const setBounds = React.useCallback(
      (rect: DOMRect) => {
        if (!localRef.current) return;
        const containerRect = localRef.current.getBoundingClientRect();
        const offset = boundsOffset ?? {};
        setBoundsState({
          top: rect.top - containerRect.top + (offset.top ?? 0),
          left: rect.left - containerRect.left + (offset.left ?? 0),
          width: rect.width + (offset.width ?? 0),
          height: rect.height + (offset.height ?? 0),
        });
      },
      [boundsOffset]
    );

    const clearBounds = React.useCallback(() => setBoundsState(null), []);

    const contextValue = React.useMemo<MotionHighlightContextValue>(
      () => ({
        mode,
        activeValue,
        setActiveValue,
        id,
        hover,
        className,
        activeClassName,
        setActiveClassName,
        transition,
        disabled,
        enabled,
        exitDelay,
        setBounds,
        clearBounds,
      }),
      [
        mode,
        activeValue,
        setActiveValue,
        id,
        hover,
        className,
        activeClassName,
        transition,
        disabled,
        enabled,
        exitDelay,
        setBounds,
        clearBounds,
      ]
    );

    const mappedChildren = controlledItems
      ? children
      : React.Children.map(children, (child, index) => (
          <MotionHighlightItem key={index} className={itemsClassName}>
            {child as React.ReactNode}
          </MotionHighlightItem>
        ));

    if (!enabled) {
      return <>{children}</>;
    }

    return (
      <MotionHighlightContext.Provider value={contextValue}>
        <div
          ref={localRef}
          className={cn(mode === "parent" && "relative", containerClassName)}
          data-slot="motion-highlight-container"
          {...props}
        >
          {mode === "parent" && (
            <AnimatePresence initial={false}>
              {boundsState && (
                <motion.div
                  layoutId={`motion-highlight-parent-${id}`}
                  className={cn("absolute z-0 bg-muted", className, activeClassName)}
                  animate={{
                    top: boundsState.top,
                    left: boundsState.left,
                    width: boundsState.width,
                    height: boundsState.height,
                    opacity: 1,
                  }}
                  initial={{
                    top: boundsState.top,
                    left: boundsState.left,
                    width: boundsState.width,
                    height: boundsState.height,
                    opacity: 0,
                  }}
                  exit={{
                    opacity: 0,
                    transition: { ...transition, delay: (transition.delay ?? 0) + (exitDelay ?? 0) },
                  }}
                  transition={transition}
                />
              )}
            </AnimatePresence>
          )}
          {mappedChildren}
        </div>
      </MotionHighlightContext.Provider>
    );
  }
);

MotionHighlight.displayName = "MotionHighlight";

export const MotionHighlightItem = React.forwardRef<HTMLDivElement, MotionHighlightItemProps>(
  (
    {
      children,
      value,
      className,
      activeClassName,
      disabled,
      transition,
      exitDelay,
      onMouseEnter,
      onMouseLeave,
      onClick,
      ...props
    },
    ref
  ) => {
    const {
      mode,
      activeValue,
      setActiveValue,
      id,
      hover,
      className: contextClassName,
      transition: contextTransition,
      disabled: contextDisabled,
      exitDelay: contextExitDelay,
      setActiveClassName,
      setBounds,
      clearBounds,
    } = useMotionHighlightContext();

    const localRef = React.useRef<HTMLDivElement>(null);
    React.useImperativeHandle(ref, () => localRef.current as HTMLDivElement);

    const childValue = value ?? React.useId();
    const isActive = activeValue === childValue;
    const isDisabled = disabled ?? contextDisabled ?? false;
    const itemTransition = transition ?? contextTransition;

    React.useEffect(() => {
      if (mode !== "parent") return;
      if (isActive && localRef.current) {
        setBounds(localRef.current.getBoundingClientRect());
        setActiveClassName(activeClassName ?? "");
      } else if (!activeValue) {
        clearBounds();
      }
    }, [mode, isActive, activeValue, setBounds, clearBounds, setActiveClassName, activeClassName]);

    const handlers = hover
      ? {
          onMouseEnter: (event: React.MouseEvent<HTMLDivElement>) => {
            if (!isDisabled) {
              setActiveValue(childValue);
            }
            onMouseEnter?.(event);
          },
          onMouseLeave: (event: React.MouseEvent<HTMLDivElement>) => {
            if (!isDisabled) {
              setActiveValue(null);
            }
            onMouseLeave?.(event);
          },
        }
      : {
          onClick: (event: React.MouseEvent<HTMLDivElement>) => {
            if (!isDisabled) {
              setActiveValue(childValue);
            }
            onClick?.(event);
          },
        };

    return (
      <div
        ref={localRef}
        className={cn(mode === "children" && "relative", className)}
        data-value={childValue}
        data-active={isActive ? "true" : "false"}
        data-highlight="true"
        data-disabled={isDisabled}
        data-slot="motion-highlight-item-container"
        {...handlers}
        {...props}
      >
        {mode === "children" && (
          <AnimatePresence initial={false}>
            {isActive && !isDisabled && (
              <motion.div
                layoutId={`motion-highlight-item-${id}`}
                className={cn("absolute inset-0 z-0 bg-muted", contextClassName, activeClassName)}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: {
                    ...itemTransition,
                    delay: (itemTransition.delay ?? 0) + (exitDelay ?? contextExitDelay ?? 0),
                  },
                }}
                transition={itemTransition}
                data-slot="motion-highlight"
              />
            )}
          </AnimatePresence>
        )}
        <div className="relative z-[1]" data-slot="motion-highlight-item">
          {children}
        </div>
      </div>
    );
  }
);

MotionHighlightItem.displayName = "MotionHighlightItem";

export default MotionHighlight;
