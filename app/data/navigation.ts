import type { NavItem } from "../types";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsIcon from '@mui/icons-material/Collections';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import StorefrontIcon from '@mui/icons-material/Storefront';


export const navigation: NavItem[] = [
  { label: "HOME", path: "../home/", Icon: HomeIcon},
  { label: "EVENTS", path: "../events/", Icon: EmojiEventsIcon},
  { label: "SCHEDULE", path: "../schedule/", Icon: CalendarMonthIcon},
  { label: "MEMBERSHIP", path: "../membership/", Icon: CardMembershipIcon },
  { label: "STALLS", path: "../stalls/", Icon: StorefrontIcon },
  { label: "SPONSORS", path: "../sponsors/", Icon: FavoriteIcon},
  { label: "GALLERY", path: "../gallery/", Icon: CollectionsIcon },
  { label: "CONTACT", path: "../contact/",  Icon: ContactMailIcon},
  { label: "ABOUT", path: "../about/", Icon: InfoIcon},
];

export const adminNavigation: NavItem[] = [
  { label: "ADMIN", path: "../admin/", Icon: AdminPanelSettingsIcon},
];
