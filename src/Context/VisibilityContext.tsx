import { createContext } from "react";

export const SidebarVisibilityContext = createContext<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}>({
  visible: false,
  setVisible: () => {},
});

export const NavbarVisibilityContext = createContext<{
  visible: boolean;
  setVisible: (visible: boolean) => void;
}>({
  visible: true,
  setVisible: () => {},
});
