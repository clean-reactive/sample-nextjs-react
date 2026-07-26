export interface TodoItemController {
  onCheckedChange: () => void;
  onDeleteClick: () => void;
}

export interface TodoItemPresenter {
  isChecked: boolean;
  isMarkedForDeletion: boolean;
  isCheckboxDisabled: boolean;
  isDeleteButtonVisible: boolean;
  isDeleteButtonDisabled: boolean;
}
