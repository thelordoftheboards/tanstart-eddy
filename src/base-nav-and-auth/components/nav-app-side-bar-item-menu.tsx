import { Link } from '@tanstack/react-router';
import { ChevronRight, type LucideIcon } from 'lucide-react';
import React from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '~/components/ui/collapsible';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '~/components/ui/sidebar';

export type MenuItemWithUrl = {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
};

export type MenuItemWithSubItems = {
  title: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items: MenuItemWithUrl[];
};

export type MenuItem = MenuItemWithSubItems | MenuItemWithUrl;

export function NavAppSidebarItemMenu({ items }: { items: MenuItem[] }) {
  const { isMobile, setOpenMobile } = useSidebar();

  const closeSidebarOnMobile = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item: MenuItemWithSubItems | MenuItemWithUrl) => (
          <React.Fragment key={item.title}>
            {'items' in item && (
              <Collapsible className="group/collapsible" defaultOpen={item.isActive} render={<SidebarMenuItem />}>
                <CollapsibleTrigger render={<SidebarMenuButton tooltip={item.title} />}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                  <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <SidebarMenuSub>
                    {item.items?.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton render={<Link onClick={closeSidebarOnMobile} to={subItem.url} />}>
                          {subItem.icon && <subItem.icon />}
                          <span>{subItem.title}</span>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </CollapsibleContent>
              </Collapsible>
            )}
            {'url' in item && (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton render={<Link onClick={closeSidebarOnMobile} to={item.url} />}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </React.Fragment>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
