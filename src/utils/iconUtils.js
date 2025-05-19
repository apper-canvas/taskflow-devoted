import {
  AlertCircle,
  ArrowUpDown,
  Calendar,
  CheckCircle,
  CheckSquare,
  Clock,
  Edit,
  Flag,
  Folder,
  FolderPlus,
  List,
  ListTodo,
  LogOut,
  Moon,
  Plus,
  PlusCircle,
  RefreshCw,
  Search,
  Sun,
  Tag,
  Trash2,
  X
} from 'lucide-react';

/**
 * Get icon component by name
 * @param {string} iconName - Name of the icon
 * @returns {React.ComponentType} - The icon component
 */
export const getIcon = (iconName) => {
  const icons = {
    'alert-circle': AlertCircle,
    'check-circle': CheckCircle,
    'check-square': CheckSquare,
    'clock': Clock,
    'edit': Edit,
    'flag': Flag,
    'folder': Folder,
    'list': List,
    'list-todo': ListTodo,
    'moon': Moon,
    'plus': Plus,
    'plus-circle': PlusCircle,
    'search': Search,
    'sun': Sun,
    'tag': Tag,
    'trash-2': Trash2,
    'x': X,
    'calendar': Calendar,
    'arrow-up-down': ArrowUpDown,
    'folder-plus': FolderPlus,
    'refresh-cw': RefreshCw,
    'log-out': LogOut
  };
  
  if (!icons[iconName]) {
    console.warn(`Icon "${iconName}" not found`);
    return icons['alert-circle']; // Default icon
  }
  
  return icons[iconName];
};