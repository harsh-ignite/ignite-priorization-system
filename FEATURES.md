# Eisenhower Matrix Prioritization System

A modern, interactive prioritization system built with Vue 3, TypeScript, and Pinia for Ignite Solutions.

## Features

### 1. **Eisenhower Matrix Visualization**
- Four-quadrant matrix displaying tasks based on urgency and importance
- **Do First** (Important & Urgent) - Red quadrant
- **Schedule** (Important & Not Urgent) - Blue quadrant
- **Delegate** (Not Important & Urgent) - Yellow quadrant
- **Eliminate** (Not Important & Not Urgent) - Green quadrant

### 2. **Task Management**
- **Create Cards**: Add new tasks with the form in the left sidebar
- **View Cards**: See all created cards listed in the left sidebar with color-coded quadrant indicators
- **Edit Cards**: Click on any card to view and edit its details in the right panel
- **Delete Cards**: Remove cards you no longer need
- **Real-time Updates**: Matrix updates instantly when cards are modified

### 3. **Card Properties**
Each card contains the following fields:
- **Title**: Task name (required)
- **Urgency**: Scale 1-10 (1-5 = Low, 6-10 = High)
- **Importance**: Scale 1-10 (1-5 = Low, 6-10 = High)
- **Effort**: Scale 1-10 (effort required to complete)
- **Owner**: Person responsible for the task (required)

### 4. **User Interface**
- **Toolbar**: Displays Ignite Solutions logo and application title
- **Left Sidebar**: 
  - Card list showing all created cards
  - Form to create new cards
  - Color-coded cards by quadrant
- **Center Area**: Eisenhower Matrix with four quadrants
- **Right Panel**: 
  - View card details
  - Edit card properties
  - Delete cards
  - Save changes

### 5. **State Management**
- Built with **Pinia** for reactive state management
- All cards are stored in application state
- Automatic synchronization across all components
- No backend required (in-memory storage)

### 6. **Animations & Styling**
- Smooth transitions on card interactions
- Hover effects on clickable elements
- Color-coded visual feedback
- Responsive layout with proper spacing
- Professional Tailwind CSS styling

## Technology Stack

- **Vue 3**: Progressive JavaScript framework
- **TypeScript**: Type-safe development
- **Pinia**: State management library
- **Tailwind CSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

## Getting Started

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
The application will be available at `http://localhost:5174`

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

## How to Use

1. **Create a Task**:
   - Fill in the form in the left sidebar
   - Set urgency and importance using sliders
   - Click "Add Card" to create the task

2. **View Tasks**:
   - All tasks appear in the left sidebar list
   - Tasks are automatically placed in the correct quadrant in the matrix
   - Click any card to view full details

3. **Edit a Task**:
   - Click on a card in the sidebar or matrix
   - Click "Edit" in the right panel
   - Modify the properties
   - Click "Save" to update

4. **Delete a Task**:
   - Select a card
   - Click "Delete" in the right panel
   - Confirm the deletion

## Project Structure

```
src/
├── components/
│   ├── Toolbar.vue              # Top navigation bar
│   ├── CardList.vue             # Left sidebar card list
│   ├── CardForm.vue             # Form to create new cards
│   ├── EisenhowerMatrix.vue      # Main matrix visualization
│   └── CardDetailsPanel.vue      # Right panel for editing
├── stores/
│   └── cardStore.ts             # Pinia store for state management
├── App.vue                       # Main application component
├── main.ts                       # Application entry point
└── style.css                     # Global styles
```

## Key Components

### CardStore (Pinia)
Manages all application state:
- `cards`: Array of all created cards
- `selectedCardId`: Currently selected card
- `addCard()`: Create new card
- `updateCard()`: Modify existing card
- `deleteCard()`: Remove card
- `selectCard()`: Select card for viewing/editing

### EisenhowerMatrix
Displays the four-quadrant matrix with:
- Dynamic card placement based on urgency/importance
- Click handlers for card selection
- Color-coded quadrants
- Empty state messages

### CardDetailsPanel
Right sidebar for:
- Viewing card details
- Editing card properties
- Deleting cards
- Form validation

## Color Scheme

- **Red**: Do First (Important & Urgent)
- **Blue**: Schedule (Important & Not Urgent)
- **Yellow**: Delegate (Not Important & Urgent)
- **Green**: Eliminate (Not Important & Not Urgent)

## Notes

- All data is stored in application state (no persistence)
- The application uses Tailwind CSS for styling
- Smooth animations enhance user experience without being intrusive
- Responsive design works on different screen sizes
- Form validation ensures data integrity
