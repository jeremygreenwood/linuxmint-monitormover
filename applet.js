const Applet 	= imports.ui.applet;
const Lang 		= imports.lang;
const PopupMenu = imports.ui.popupMenu;
const Mainloop 	= imports.mainloop;
const Settings 	= imports.ui.settings;
const Gio 		= imports.gi.Gio;
const Main 		= imports.ui.main;

function MyApplet( metadata, orientation, panel_height, instance_id )
{
    this._init( metadata, orientation, panel_height, instance_id );
}

MyApplet.prototype =
{
    __proto__: Applet.TextIconApplet.prototype,

    _init: function( metadata, orientation, panel_height, instance_id )
    {
        Applet.IconApplet.prototype._init.call( this, orientation, panel_height, instance_id );

        this.menuManager = new PopupMenu.PopupMenuManager( this );
        this.menu = new Applet.AppletPopupMenu( this, orientation );
        this.menuManager.addMenu( this.menu );

        this.settings = new Settings.AppletSettings( this, "monitormover@greenwoodj", instance_id );

        /*----------------------------------------------------------
        Setup next monitor hotkey binding
        ----------------------------------------------------------*/
        this.settings.bindProperty
            (
            Settings.BindingDirection.IN,
            "keybinding-next",
            "keybinding",
            this.on_keybinding_changed,
            null
            );

        /*----------------------------------------------------------
        Setup initial applet state
        ----------------------------------------------------------*/
        this.on_keybinding_changed();
        this.on_settings_changed();

        try
        {
            this.set_applet_icon_path( metadata.path + "/dual-monitors.png" );
        }
        catch( e )
        {
            global.logError( e );
        }
    },

    on_keybinding_changed: function()
    {
        Main.keybindingManager.addHotKey( "must-be-unique-id", this.keybinding, Lang.bind( this, this.on_hotkey_triggered ) );
    },

    on_settings_changed: function()
    {
    },

    on_hotkey_triggered: function()
    {
    },

    on_applet_clicked: function( event )
    {
        this.menu.toggle();
    },

    on_applet_removed_from_panel: function()
    {
        this.settings.finalize();
    }
};

function main( metadata, orientation, panel_height, instance_id )
{
    let myApplet = new MyApplet( metadata, orientation, panel_height, instance_id );
    return myApplet;
}

