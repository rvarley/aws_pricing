AWS Pricing 
-------------------

** This is a tool to pull spot and on demand pricing from AWS API **

Built With
----------

* javascript / jquery
* html
* css
* jquery.sticky (keeps spreadsheet header row at top of table)

Requirements
------------
* Display the demand/spot price spread by instance type and region - complete
* Display the top 10 price per vCPU instances across all regions - not complete
* Display the cheapest region overall - complete.  Note that some spot pricing is not available.  These instances were ommitted from perVCPU pricing.

Site Demo
---------

.. image:: demo.gif


To Do's
-------
* Add spot pricing price per vCPU to end of existing on demand rows instead
of appending to table
* Clean up display of least expensive region
* Add top 10 pricing requirement

License
-------
Copyright (c) 2015 E-Bike Configurator by VarleyRansom

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.  IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE

Questions
---------
For questions, please contact me on [Twitter](https://twitter.com/ransomv).
