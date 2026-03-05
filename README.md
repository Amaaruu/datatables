# DataTables (Drupal 11 Ready)

The DataTables module integrates the DataTables jQuery plugin into Drupal which
provides advanced interaction controls to HTML tables such as dynamic
pagination, on-the-fly filtering, column sorting, and HTML5 Export Buttons.

## Requirements

This module uses official CDNs to load the DataTables 2.x library and its dependencies. 
**No manual library downloads are required.**

## Installation

1. Install as you would normally install a contributed Drupal module.
   See: [Installing Modules](https://www.drupal.org/docs/extending-drupal/installing-modules)
2. Install via composer:
   `composer require 'drupal/datatables:^2.0'`
3. Enable the module.

## Configuration

- Create a new view at Structure » Views » Add new view
- Select DataTables as the view style.
- Add fields to show in the table.
- In the DataTables settings, you can enable Export Buttons (Excel, CSV, Print) which are powered by the modern DataTables Buttons extension.