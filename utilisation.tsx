UTILISATION : 

TOASTSTACK : 
import { useToast } from '../hooks/useToast'

function MyComponent() {
  const toast = useToast()

  function handleAddFilm() {
    // ... ajout du film
    toast.success('Film ajouté ✓')
  }

  function handleError() {
    toast.error('Connexion impossible')
  }

  // ...
}