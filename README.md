Visualize the STN config
========================

Generate graphs based on two different sets of input. 

1. Output

´´´
level1=1
level1=1 leaf1 1
level1=1,level2=1
level1=1,level2=1 leaf2 2
level1=1,level2=1 leaf3 3
level1=1,level2=2
level1=1,level2=2 leaf4 4
level1=1,level2=2,level3=1
level1=1,level2=2,level3=1 leaf5 5
level1=1,level2=2,level3=2
level1=1,level2=2,level3=2 leaf6 6
´´´

2. XML
´´´
<?xml version="1.0" encoding="UTF-8" ?>
<config>
<level1 instanceId="0">
  <level2 instanceId="1">
    <leaf2>2</leaf2>
    <leaf3>3</leaf3>
  </level2>
  <level2 instanceId="2">
    <leaf4>4</leaf4>
    <level3 instanceId="1">
      <leaf5>5</leaf5>
    </level3>
    <level3 instanceId="2">
      <leaf6>6</leaf6>
    </level3>
  </level2>
</level1>
</config>
´´´