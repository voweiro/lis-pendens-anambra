import { HomeIcon } from "@heroicons/react/24/outline";
import { IoStatsChart } from "react-icons/io5";
import { LuUsers } from "react-icons/lu";
import { PiFlagPennantBold } from "react-icons/pi";
import { GrPieChart } from "react-icons/gr";
import { SlSettings } from "react-icons/sl";
import { LiaBriefcaseSolid } from "react-icons/lia";
import { RxViewVertical } from "react-icons/rx";
import UserSearchHistoryIcon from "@/asserts/search-icon.svg";

// Navigation links
export const userNavigation = [
  {
    name: "Dashboard",
    href: "/user",
    key: "home",
    icon: HomeIcon,
    current: false,
  },
  {
    name: "Search History",
    href: "/user/search-history",
    key: "search-history",
    icon: UserSearchHistoryIcon,
    current: false,
  },
  {
    name: "Settings",
    href: "/user/settings",
    key: "settings",
    icon: SlSettings,
    current: false,
  },
];

// super admin navigation
export const superAdminNavigation = [
  {
    name: "Dashboard",
    href: "/admin",
    key: "dashboard",
    icon: HomeIcon,
    current: false,
  },
  {
    name: "Manage Cases",
    href: "/admin/manage-cases",
    key: "manage-cases",
    icon: LiaBriefcaseSolid,
    current: false,
  },
  {
    name: "Users",
    href: "/admin/users",
    key: "users",
    icon: LuUsers,
    current: false,
  },
  {
    name: "Activity Logs",
    href: "/admin/activities-logs",
    key: "activity-logs",
    icon: IoStatsChart,
    current: false,
  },
  {
    name: "Flagged Cases",
    href: "/admin/flagged-cases",
    key: "activity-logs",
    icon: PiFlagPennantBold,
    current: false,
  },
  {
    name: "Data Reports",
    href: "/admin/data-reports",
    key: "data-reports",
    icon: GrPieChart,
    current: false,
  },
  {
    name: "Settings",
    href: "/admin/settings",
    key: "settings",
    icon: SlSettings,
    current: false,
  },
];

// court registrar navigation
export const courtRegistrarNavigation = [
  {
    name: "Dashboard",
    href: "/court-registrar",
    key: "court-registrar-dashboard",
    icon: RxViewVertical,
    current: false,
  },
  {
    name: "Manage Cases",
    href: "/court-registrar/manage-cases",
    key: "court-registrar-manage-cases",
    icon: LiaBriefcaseSolid,
    current: false,
  },
  {
    name: "Activity Logs",
    href: "/court-registrar/activity-logs",
    key: "court-registrar-activity-logs",
    icon: IoStatsChart,
    current: false,
  },
  {
    name: "Flagged Cases",
    href: "/court-registrar/flagged-cases",
    key: "flagged-cases",
    icon: PiFlagPennantBold,
    current: false,
  },
  {
    name: "Settings",
    href: "/court-registrar/settings",
    key: "court-registrar-settings",
    icon: SlSettings,
    current: false,
  },
];

// Table dummy data
export const historyData = [
  {
    id: 1,
    propertyTitle: "Deelaw Housing & Real Estates Ag...",
    location: "Plot 1-5 Lamido crescent, Abuja",
    status: "Pending",
    registerTitleNo: "LP24452168PD",
  },
  {
    id: 2,
    propertyTitle: "Golden boys Estate",
    location: "5 apple avenue Nomansland, Jos",
    status: "On appeal",
    registerTitleNo: "LP23256718AC",
  },
  {
    id: 3,
    propertyTitle: "Okpara & sons real estates",
    location: "2/3 Russel avenue Taurani, kano",
    status: "Disposed",
    registerTitleNo: "LP11342890ZA",
  },
];

export const getSerialNumber = (id, data, currentPage, pageSize) => {
  const index = data.findIndex((object) => object._id === id);
  const startIndex = (currentPage - 1) * pageSize;
  return index !== -1 ? startIndex + index + 1 : "";
};

//Search result page dummy data
export const searchResults = [
  {
    id: 0,
    title:
      "Computer village abeokuta area GRA Close to Oando filling station Lagos.",
    nameOfOwner: "Emeka Okpara Nigeria Ltd",
    surveyPlanNum: "LP76890643",
  },
  {
    id: 1,
    title: "Abeokuta area 1 ado ekiti",
    nameOfOwner: "Emeka Okpara Nigeria Ltd",
    surveyPlanNum: "LP76890643",
  },
];

//Related searches dummy data
export const relatedSearches = [
  {
    id: 0,
    title: "Abeokuta area counsel wuse2",
  },
];

// Permission data Under Add User in Super admin

export const permissionData = [
  {
    id: 1,
    title: "Upload access",
    name: "Upload access",
  },
  {
    id: 2,
    title: "Edit access",
    name: "Edit access",
  },
  {
    id: 3,
    title: "Delete access",
    name: "Delete access",
  },
];

// Bar Chart  in Super admin Dashboard

export const filterReportData = [
  {
    id: 1,
    name: "Pending records",
  },
  {
    id: 2,
    name: "Total searches",
  },
  {
    id: 3,
    name: "On-appeal records",
  },
  {
    id: 4,
    name: "Dismissed records",
  },
];

//Faq page data
export const faqData = [
  {
    id: 1,
    question: "What is Enugu e-Lis Pendens?",
    answer: "Enugu e-Lis Pendens is a service that provides information on properties in Enugu State, Nigeria that may be subject to a lawsuit (lis pendens) or have other encumbrances. We help you make informed decisions about real estate by highlighting potential legal issues associated with a property.",
  },
  {
    id: 2,
    question: "What are the benefits of using Enugu e-Lis Pendens?",
    answer: "By searching our database, you can avoid unknowingly purchasing a property with legal issues, protect yourself from financial loss and future litigation and make informed choices about property investments.",
  },
  {
    id: 3,
    question: 'What does "lis pendens" mean?',
    answer: 'Lis pendens is a Latin term meaning "suit pending." It refers to a lawsuit involving the ownership or rights to a specific property. A lis pendens notice is filed in the land registry to alert potential buyers of the ongoing legal dispute.',
  },
  {
    id: 4,
    question: "How do I search for properties on Enugu e-Lis Pendens?",
    answer: "You can search our database using various criteria, such as property address, certificate of occupancy number, or owner's name.",
  },
  {
    id: 5,
    question: "What information do the search results provide?",
    answer: "The search results will indicate if a property has a lis pendens or other encumbrances registered against it. It may also provide brief details about the nature of the lawsuit or encumbrance.",
  },
  {
    id: 6,
    question: "What if the search results show a lis pendens on a property I'm interested in?",
    answer: "If a property has a lis pendens, it's advisable to consult with a lawyer to understand the potential risks involved before proceeding with the purchase.",
  },
  {
    id: 7,
    question: "How do your Services work?",
    answer: "For sustainability, we are a paid service. For a fee we allow you to search our database for properties you might be interested in to find out if they may be the subject of a suit. Where there's a match, we provide you with the suit details or nature of known encumbrance on the property.",
  },
  {
    id: 8,
    question: "Do you offer any legal advice?",
    answer: "Enugu e-Lis Pendens is an informational service and does not provide legal advice. We recommend consulting with a qualified lawyer for legal guidance on specific property issues.",
  },
  {
    id: 9,
    question: "Do you help with filing lis pendens notices?",
    answer: "Our core function is searching for existing lis pendens filings. We may be able to provide information on the process of filing a lis pendens notice, but it's always best to consult with a lawyer for this purpose.",
  },
];



export const roleData = [
  { id: 1, name: "superadmin" },
  { id: 2, name: "user" },
  { id: 3, name: "registrar" },
];

export const statusDisputeData = [
  { id: 1, name: "Pending" },
  { id: 2, name: "On appeal" },
  { id: 3, name: "Disposed" },
];
