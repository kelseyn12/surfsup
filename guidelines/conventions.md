# SurfSUP App Coding Conventions

This document outlines the consistent layout, naming conventions, and coding style for the SurfSUP application.

## Directory Structure

The project follows a standard React Native directory structure:

```
/app/
  /src/
    /assets/       # Images, icons, fonts, etc.
      /icons/      # SVG and other icon files
      /images/     # Image files used in the app
    /components/   # Reusable UI components
    /constants/    # App constants and configuration
    /hooks/        # Custom React hooks
    /navigation/   # Navigation configuration
    /screens/      # App screens/pages
    /services/     # API services and data fetching
    /store/        # State management
    /types/        # TypeScript interfaces and types
    /utils/        # Utility functions
  /guidelines/     # Project guidelines and documentation
```

## Naming Conventions

### Files and Directories

- **Components**: PascalCase for component files (e.g., `SpotCard.tsx`)
- **Utilities**: camelCase for utility files (e.g., `formatters.ts`)
- **Screens**: PascalCase (e.g., `SpotDetails.tsx`)
- **Directories**: camelCase (e.g., `components/`, `utils/`)
- **Test Files**: Same name as the file they test with `.test` or `.spec` suffix (e.g., `SpotCard.test.tsx`)

### Code Elements

- **Components**: PascalCase (e.g., `SpotCard`, `WaveHeightIndicator`)
- **Functions**: camelCase (e.g., `calculateDistance`, `formatWaveHeight`)
- **Variables**: camelCase (e.g., `currentUser`, `selectedSpot`)
- **Interfaces/Types**: PascalCase (e.g., `SurfSpot`, `User`)
- **Constants**: UPPER_SNAKE_CASE for top-level constants, PascalCase for constant objects

### Component Structure

React components should follow this structure:

```typescript
// Imports
import React, { useState, useEffect } from 'react';
import { View, Text } from 'react-native';

// Types
interface Props {
  // Props definition
}

// Component
export const ComponentName: React.FC<Props> = ({ prop1, prop2 }) => {
  // State and hooks
  const [state, setState] = useState<Type>(initialValue);
  
  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };
  
  // Helper functions
  const calculateSomething = () => {
    // Helper logic
  };
  
  // Render
  return (
    <View>
      {/* JSX here */}
    </View>
  );
};
```

## Code Style

### TypeScript

- Always use TypeScript for type safety
- Define interfaces for all component props
- Use type inference when possible, but explicit types where helpful
- Use optional properties (e.g., `property?: string`) rather than union with undefined (e.g., `property: string | undefined`)

### React & React Native Practices

- Use functional components with hooks instead of class components
- Keep components small and focused on a single responsibility
- Extract reusable logic into custom hooks
- Use React Navigation for navigation between screens
- Use descriptive prop names

### Styling

- Use React Native's StyleSheet for styling components
- Group related styles together
- Use constants for colors, spacing, font sizes, etc.
- Name styles clearly (e.g., `container`, `headerText`, not `style1`, `text1`)

Example:

```typescript
import { StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../constants';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.background,
    padding: SPACING.md,
  },
  headerText: {
    color: COLORS.primary,
    fontSize: FONT_SIZES.header,
    fontWeight: 'bold',
  },
});
```

### Imports

- Group imports in the following order:
  1. External libraries (React, React Native)
  2. Internal components/hooks
  3. Constants/utilities
  4. Types
  5. Assets/styles

### Comments

- Use JSDoc style comments for functions and components
- Include param and return type descriptions for complex functions
- Use inline comments for non-obvious code sections
- Comment complex algorithms or business logic

## State Management

- Use React Context with hooks for global state that doesn't change frequently
- For more complex state, consider using Redux or Zustand

## Form Handling

- Use Formik or React Hook Form for complex forms
- Implement proper validation using Yup or similar libraries

## API and Data Fetching

- Use React Query or SWR for data fetching, caching, and state management
- Handle loading and error states consistently
- Implement proper retry and timeout mechanisms

## Testing

- Write unit tests for utility functions
- Write component tests for UI components
- Use React Native Testing Library for component testing
- Use Jest for unit testing

## Performance Considerations

- Memoize expensive calculations with useMemo
- Memoize callback functions with useCallback
- Use FlatList or SectionList instead of ScrollView with many items
- Implement virtualization for long lists
- Lazy load screens and components when possible 