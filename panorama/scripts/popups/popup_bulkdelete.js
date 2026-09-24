"use strict"

var m_BulkDeleteTimeoutScheduledHandle = null
var m_DeleteOperationScheduledHandle = null
var m_numSubjectItems = 1
var m_itemidSubject = ""
var m_arrSubjectItemsRemaining = []

var SetupPopup = function () {
  $.GetContextPanel().SetDialogVariable(
    "title",
    $.Localize("#popup_bulkdelete_title")
  )

  var itemidsList = $.GetContextPanel().GetAttributeString(
    "subject_item_id",
    ""
  )
  ConfigurePopupFromItemsList(itemidsList)

  $.RegisterForUnhandledEvent(
    "PanoramaComponent_MyPersona_InventoryUpdated",
    OnDeleteItemUpdated
  )
}

var ConfigurePopupFromItemsList = function (itemidsList) {
  m_arrSubjectItemsRemaining = itemidsList.split(",")

  m_numSubjectItems = m_arrSubjectItemsRemaining.length
  $.GetContextPanel().SetDialogVariableInt("count", m_numSubjectItems)
  $("#ItemsRemaining").visible = m_numSubjectItems > 1
  $("#PopupButtonRow").visible = m_numSubjectItems > 1

  var itemid = m_arrSubjectItemsRemaining.splice(0, 1)[0]
  m_itemidSubject = itemid

  if (!InventoryAPI.GetItemRarityColor(m_itemidSubject)) {
    PanelTimedOut()
    return
  }

  var elItem = $("#ItemPanel")
  elItem.SetAttributeString("itemid", itemid)
  elItem.BLoadLayoutSnippet("LootListItem")

  elItem.FindChildInLayoutFile("ItemImage").itemid = itemid
  elItem.FindChildInLayoutFile("JsRarity").style.backgroundColor =
    ItemInfo.GetRarityColor(itemid)
  ItemInfo.GetFormattedName(itemid).SetOnLabel(
    elItem.FindChildInLayoutFile("JsItemName")
  )

  var spinnerVisible = $.GetContextPanel().GetAttributeInt("spinner", 0)
  $("#Spinner").SetHasClass("SpinnerVisible", spinnerVisible)

  m_BulkDeleteTimeoutScheduledHandle = $.Schedule(10, PanelTimedOut)

  m_DeleteOperationScheduledHandle = $.Schedule(0.25, _LaunchDeleteOperation)
}

var PanelTimedOut = function () {
  m_BulkDeleteTimeoutScheduledHandle = null
  $.DispatchEvent("UIPopupButtonClicked", "")

  UiToolkitAPI.ShowGenericPopupOk(
    $.Localize("#SFUI_SteamConnectionErrorTitle"),
    $.Localize("#SFUI_Steam_Error_LinkUnexpected"),
    "",
    function () {},
    function () {}
  )
}

var _CancelBulkDeleteTimeoutScheduledHandle = function () {
  if (m_BulkDeleteTimeoutScheduledHandle) {
    $.CancelScheduled(m_BulkDeleteTimeoutScheduledHandle)
    m_BulkDeleteTimeoutScheduledHandle = null
  }
}

var _ClosePopUp = function () {
  $.DispatchEvent("UIPopupButtonClicked", "")
}

function OnRequestCancelBatch() {
  m_arrSubjectItemsRemaining = []
}

function OnDeleteItemUpdated() {
  _CancelBulkDeleteTimeoutScheduledHandle()

  if (m_DeleteOperationScheduledHandle) return

  if (m_arrSubjectItemsRemaining.length > 0) {
    var strItemIDs = m_arrSubjectItemsRemaining.join(",")
    ConfigurePopupFromItemsList(strItemIDs)
  } else {
    _ClosePopUp()
  }
}

var _LaunchDeleteOperation = function () {
  m_DeleteOperationScheduledHandle = null
  InventoryAPI.DeleteItem(m_itemidSubject)
}
