'use strict';

var MOTDPanel = (function() {

    var _m_hDenyInputToGame = null;

    var elMOTDPanel = $.GetContextPanel().FindChildTraverse('MOTDPanel_HTML');

    var _Init = function() {

        if (elMOTDPanel) {
            elMOTDPanel.SetURL( MatchStatsAPI.GetServerWebsiteURL( true ) );
        }

        try {
            _m_hDenyInputToGame = UiToolkitAPI.AddDenyInputFlagsToGame(elMOTDPanel, "MOTDPanel_HTML", "CaptureMouse" );
        } catch (error) {
            
        }
    };

    function _HTMLOpenPopupTab(objHtmlEventTarget, objHtml, sUrl) {
        UiToolkitAPI.ShowGenericPopupYesNo( 
            'External Link', 
            'You are about to open <b>' + sUrl + '</b> externally in your Browser.\n\nAre you sure that you want to open this link?',
             '', 
             function() { SteamOverlayAPI.OpenUrlInOverlayOrExternalBrowser(sUrl); },
             function() { } )
    }

    function _OnGoPressed() {
        _Hide();
    }

    function _Hide() {
        $.Msg($.GetContextPanel());
        $.GetContextPanel().RemoveAndDeleteChildren();
        UiToolkitAPI.ReleaseDenyInputFlagsToGame(_m_hDenyInputToGame);
        _m_hDenyInputToGame = null;
    }

    return {
        Init: _Init,
        HTMLOpenPopupTab: _HTMLOpenPopupTab,
        OnGoPressed: _OnGoPressed,
        Hide: _Hide
    };
})();

(function() {
    MOTDPanel.Init();
    $.RegisterEventHandler("HTMLOpenPopupTab", $.GetContextPanel().FindChildTraverse('MOTDPanel_HTML'), MOTDPanel.HTMLOpenPopupTab);
})();