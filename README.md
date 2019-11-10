![2019-11-10-153443_296x329_scrot](https://user-images.githubusercontent.com/26948028/68551159-899b6e80-03cf-11ea-8476-35950b3cef4c.png)

# Pie Chart Input
Custom HTML Element for selecting percentages.

## Installation / Usage
Include `<script src="piechartinput.js"></script>` in the body of your html file.

The tag is `<pie-input>`, and the available attributes are `size` (in pixels), `values` (comma-separated list) and `initial-angle` (in radians).

Example:

```<pie-input size="300" values=".25, .45, .3" initial-angle="3.14"></pie-input>```

The `values` attribute is updated every time the input is manipulated, so they can be accessed with

```document.querySelector('pie-input').getAttribute('values')```
