import type { NavItem } from "../types";
import HomeIcon from '@mui/icons-material/Home';
import InfoIcon from '@mui/icons-material/Info';
import FavoriteIcon from '@mui/icons-material/Favorite';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CollectionsIcon from '@mui/icons-material/Collections';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import Home from "../pages/home/Home";
import Events from "../pages/events/Events";
import Schedule from "../pages/schedule/Schedule";
import Membership from "../pages/membership/Membership";
import Gallery from "../pages/gallery/Gallery";
import About from "../pages/about/About";
import Contact from "../pages/contact/Contact";
import Sponsors from "../pages/sponsors/Sponsors";

export const navigation: NavItem[] = [
  { label: "HOME", path: "../home/", Icon: HomeIcon, Content: Home},
  { label: "EVENTS", path: "../events/", Icon: EmojiEventsIcon, Content: Events},
  { label: "SCHEDULE", path: "../schedule/", Icon: CalendarMonthIcon, Content: Schedule},
  { label: "MEMBERSHIP", path: "../membership/", Icon: CardMembershipIcon , Content: Membership},
  { label: "SPONSORS", path: "../sponsors/", Icon: FavoriteIcon, Content: Sponsors},
  { label: "GALLERY", path: "../gallery/", Icon: CollectionsIcon , Content: Gallery},
  { label: "CONTACT", path: "../contact/",  Icon: ContactMailIcon, Content: Contact},
  { label: "ABOUT", path: "../about/", Icon: InfoIcon, Content: About},
];
