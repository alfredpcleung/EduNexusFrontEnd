import { useAuth } from '../components/auth/AuthContext';

/**
 * Custom hook to check if current user is authorized to edit/delete a resource
 * @param {string} resourceOwnerId - The uid of the resource owner
 * @returns {object} - { canEdit: boolean, canDelete: boolean }
 */
export const useAuthorizationCheck = (resourceOwnerId) => {
  const { user } = useAuth();

  const isOwner = user?.uid === resourceOwnerId;
  const isAdmin = user?.role === 'admin';
  const isAuthorized = isOwner || isAdmin;

  return {
    canEdit: isAuthorized,
    canDelete: isAuthorized,
    isOwner,
    isAdmin,
  };
};

export default useAuthorizationCheck;
