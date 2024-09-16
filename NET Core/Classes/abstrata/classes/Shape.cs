namespace AbtractClasse
{
    public abstract class Shape
    {
        public double Radius { get; set; }

        public abstract double CalculaterShape();

        public void Diplay()
        {
            Console.WriteLine("Display shape");
        }
    }


    public class Cicle : Shape
    {
        public override double CalculaterShape()
        {
            return Math.PI * Radius * Radius; ;
        }
    }


    public interface IDrawable{

        void Draw();
    }

    public class Drawing : IDrawable
    {
       public void Draw(){
         Console.WriteLine("Drawing");
       }
    }

}