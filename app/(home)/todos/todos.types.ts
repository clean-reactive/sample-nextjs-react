export interface TodosController {
  onUpdateAllClick: () => void;
  onBulkOperationsClick: () => void;
  onCancelClick: () => void;
}

export interface TodosPresenter {
  isEmptyMessageVisible: boolean;
  isBulkActionsVisible: boolean;
  isUpdateAllSpinnerVisible: boolean;
  isUpdateAllLabelVisible: boolean;
  isUpdateAllButtonDisabled: boolean;
}
