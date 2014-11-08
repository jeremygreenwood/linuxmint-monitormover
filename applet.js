const Applet 	= imports.ui.applet;
const Lang 		= imports.lang;
const PopupMenu = imports.ui.popupMenu;
const Mainloop 	= imports.mainloop;
const Settings 	= imports.ui.settings;
const Gio 		= imports.gi.Gio
const Main 		= imports.ui.main;

function MyApplet( orientation, panel_height, instance_id )
{
    this._init( orientation, panel_height, instance_id ); // Be sure to pass instanceId from the main function
}

MyApplet.prototype =
{
    __proto__: Applet.TextIconApplet.prototype,

    _init: function( orientation, panel_height, instance_id )
	{
        Applet.TextIconApplet.prototype._init.call( this, orientation, panel_height, instance_id );

        this.menuManager = new PopupMenu.PopupMenuManager( this );
        this.menu = new Applet.AppletPopupMenu( this, orientation );
        this.menuManager.addMenu( this.menu );

        /* Initialize your settings handler instance      this,            the uuid              instance id  */
        this.settings = new Settings.AppletSettings( this, "monitormover@greenwoodj", instance_id );

        /* Now we'll proceed with setting up individual setting bindings. */
        this.settings.bindProperty
			(
			Settings.BindingDirection.IN,
			"keybinding-next",
			"keybinding",
			this.on_keybinding_changed,
			null
			);

        /* Let's set up our applet's initial state now that we have our setting properties defined */
        this.on_keybinding_changed();
        this.on_settings_changed();
    },

    on_keybinding_changed: function() {
        Main.keybindingManager.addHotKey("must-be-unique-id", this.keybinding, Lang.bind(this, this.on_hotkey_triggered));
    },

    on_settings_changed: function()
	{
	// TODO try moving this up into main init function
		this.set_applet_label( _( "Hi there!" ) );
        
//        this.set_applet_icon_name( "dual-monitors" )
        this.set_applet_icon_path( "/home/jeremy/.local/share/cinnamon/applets/monitormover@greenwoodj/dual-monitors.png" )
    },

    on_hotkey_triggered: function()
	{
        this.set_applet_label( _( "YOU USED THE HOTKEY!!!" ) );

        let timeoutId = Mainloop.timeout_add( 3000, Lang.bind( this, function() { this.on_settings_changed(); } ) );
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
    let myApplet = new MyApplet( orientation, panel_height, instance_id );
    return myApplet;
}

