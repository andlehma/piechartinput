![image](https://user-images.githubusercontent.com/26948028/75598990-40e2f080-5a66-11ea-92fd-6342f2b03af3.png)

# Pie Chart Input
Custom HTML Element for selecting percentages.

## Installation / Usage
Include `<script src="piechartinput.js"></script>` in the body of your html file.

The tag is `<pie-input>`, and the available attributes are `size` (in pixels), `values` (comma-separated list), `initial-angle` (in radians), and `colors` (comma-separated list).

Example:

```<pie-input size="300" values=".25, .45, .3" initial-angle="3.14" colors="red, blue, #00FF00"></pie-input>```

The `values` attribute is updated every time the input is manipulated, so they can be accessed with

```document.querySelector('pie-input').getAttribute('values')```
