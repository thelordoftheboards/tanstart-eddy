import { type LucideIcon } from 'lucide-react';

export type MenuItemWithUrlType = {
  title: string;
  url: string;
  icon?: LucideIcon;
  /**
   * The item will only be displayed if the user has current organization.
   */
  requiresOrganization?: boolean;
};

export type MenuItemWithSubItemsType = {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
  /**
   * The item will only be displayed if the user has current organization,
   * regardless of whether the sub-items require organization or not.
   */
  requiresOrganization?: boolean;
  items: MenuItemWithUrlType[];
};

export type MenuItemType = MenuItemWithSubItemsType | MenuItemWithUrlType;
